import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const organizationId = url.searchParams.get("organization_id") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const requestCallback = url.searchParams.get("request_callback");
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10)));
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10));

    const supabase = await createClient();

    let autoOrgId: string | undefined;
    if (!organizationId && userId) {
      const { data: admin } = await supabase
        .from("organization_admins")
        .select("organization_id")
        .eq("clerk_user_id", userId)
        .maybeSingle();
      if (admin?.organization_id) autoOrgId = admin.organization_id;
    }

    let query = supabase
      .from("support_tickets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role && ["member", "admin", "superadmin"].includes(role)) {
      query = query.eq("raised_by_role", role);
    }
    if (organizationId || autoOrgId) {
      query = query.eq("organization_id", organizationId || autoOrgId);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (requestCallback === "true") {
      query = query.eq("request_callback", true);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const tickets = data ?? [];
    const memberIds = tickets.filter(t => t.raised_by_role === "member" && t.member_id).map(t => String(t.member_id));
    const uniqueMemberIds = [...new Set(memberIds)];
    const membersById = new Map<string, Record<string, unknown>>();
    const clerkIds = tickets.filter(t => t.raised_by_role === "member" && t.raised_by).map(t => String(t.raised_by));
    const uniqueClerkIds = [...new Set(clerkIds)];
    const membersByClerkId = new Map<string, Record<string, unknown>>();

    if (uniqueMemberIds.length > 0) {
      const { data: members, error: membersError } = await supabase
        .from("members")
        .select("id, first_name, last_name, email, phone, organization_id, organizations(name)")
        .in("id", uniqueMemberIds);
      if (!membersError) {
        for (const m of members ?? []) membersById.set(String(m.id), m);
      }
    }

    if (uniqueClerkIds.length > 0) {
      const { data: members, error: membersError } = await supabase
        .from("members")
        .select("id, clerk_user_id, first_name, last_name, email, phone, organization_id, organizations(name)")
        .in("clerk_user_id", uniqueClerkIds);
      if (!membersError) {
        for (const m of members ?? []) {
          const cid = (m as unknown as { clerk_user_id?: string }).clerk_user_id;
          if (cid) membersByClerkId.set(String(cid), m);
        }
      }
    }

    if (uniqueMemberIds.length > 0 && membersById.size === 0 && uniqueClerkIds.length > 0 && membersByClerkId.size === 0) {
      const { data: members } = await supabase
        .from("members")
        .select("id, first_name, last_name, email, phone, organization_id")
        .in("id", uniqueMemberIds);
      for (const m of members ?? []) membersById.set(String(m.id), m);
    }

    const orgIds = [...new Set(tickets.filter(t => t.organization_id).map(t => String(t.organization_id)))];
    const orgsById = new Map<string, string>();
    if (orgIds.length > 0) {
      const { data: orgs } = await supabase.from("organizations").select("id, name").in("id", orgIds);
      for (const o of orgs ?? []) orgsById.set(String(o.id), (o.name as string) || "");
    }

    const enriched = tickets.map((ticket) => {
      const base = { ...ticket } as Record<string, unknown>;
      if (ticket.raised_by_role === "member") {
        const memberIdStr = ticket.member_id ? String(ticket.member_id) : null;
        const clerkIdStr = ticket.raised_by ? String(ticket.raised_by) : null;
        let m = memberIdStr ? membersById.get(memberIdStr) : undefined;
        if (!m && clerkIdStr) m = membersByClerkId.get(clerkIdStr);

        if (m) {
          base.sender_name = `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "Member";
          base.sender_email = (m.email as string | undefined) ?? "";
          base.sender_phone = (m.phone as string | undefined) ?? "";
          const orgName = (m.organizations as unknown as { name?: string } | null)?.name;
          base.sender_org = orgName || orgsById.get(String(ticket.organization_id)) || "";
        } else {
          base.sender_name = "Member";
          base.sender_email = "";
          base.sender_phone = "";
          base.sender_org = "";
        }
      } else if (ticket.raised_by_role === "admin") {
        const adminOrg = ticket.organization_id ? orgsById.get(String(ticket.organization_id)) || "" : "";
        base.sender_name = "Organization Admin";
        base.sender_email = "";
        base.sender_phone = "";
        base.sender_org = adminOrg;
      } else if (ticket.raised_by_role === "superadmin") {
        base.sender_name = "Superadmin";
        base.sender_email = "";
        base.sender_phone = "";
        base.sender_org = "";
      } else {
        base.sender_name = "Unknown";
        base.sender_email = "";
        base.sender_phone = "";
        base.sender_org = "";
      }
      return base;
    });

    return NextResponse.json({ data: enriched, total: count ?? 0, limit, offset }, {
      headers: { "Cache-Control": "private, max-age=10, stale-while-revalidate=30" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    const body = await req.json();
    const { issue_type, description, request_callback, raised_by_role, organization_id, member_id, email } = body;

    if (!issue_type || !description) {
      return NextResponse.json({ error: "issue_type and description are required" }, { status: 400 });
    }

    const supabase = await createClient();

    let orgId = organization_id;
    let memberId = member_id;

    if (raised_by_role === "member") {
      if (userId) {
        const { data: member } = await supabase
          .from("members")
          .select("id, organization_id")
          .eq("clerk_user_id", userId)
          .maybeSingle();
        if (member) {
          memberId = member.id;
          orgId = member.organization_id;
        } else {
          try {
            const clerk = await clerkClient();
            const clerkUser = await clerk.users.getUser(userId);
            const emails = (clerkUser.emailAddresses ?? []).map(e => e.emailAddress).filter(Boolean);
            if (emails.length > 0) {
              const emailFilters = emails.map(e => `email.ilike.${e}`).join(",");
              const { data: memberByEmail } = await supabase
                .from("members")
                .select("id, organization_id")
                .or(emailFilters)
                .maybeSingle();
              if (memberByEmail) {
                memberId = memberByEmail.id;
                orgId = memberByEmail.organization_id;
              }
            }
            if (!memberId) {
              const fallbackEmail = (clerkUser.emailAddresses ?? []).find(e => e.verification?.status === "verified")?.emailAddress ?? clerkUser.primaryEmailAddress?.emailAddress;
              if (fallbackEmail) {
                const normalizedEmail = fallbackEmail.trim().toLowerCase();
                const { data: existingAny } = await supabase.from("members").select("id, organization_id").ilike("email", normalizedEmail).maybeSingle();
                if (existingAny) {
                  memberId = existingAny.id;
                  orgId = existingAny.organization_id;
                }
              }
            }
          } catch {
            // ignore Clerk lookup failures and continue with other fallbacks
          }
        }
      }
      if (!memberId && email) {
        const normalizedEmail = String(email).trim().toLowerCase();
        const { data: memberByEmail } = await supabase
          .from("members")
          .select("id, organization_id")
          .ilike("email", normalizedEmail)
          .maybeSingle();
        if (memberByEmail) {
          memberId = memberByEmail.id;
          orgId = memberByEmail.organization_id;
        }
      }
      if (!memberId) {
        memberId = body.member_id || undefined;
      }
      if (memberId && !orgId) {
        const { data: member } = await supabase
          .from("members")
          .select("organization_id")
          .eq("id", memberId)
          .maybeSingle();
        if (member?.organization_id) orgId = member.organization_id;
      }
    } else if (raised_by_role === "admin") {
      if (userId) {
        const { data: admin } = await supabase
          .from("organization_admins")
          .select("id, organization_id")
          .eq("clerk_user_id", userId)
          .maybeSingle();
        if (admin) orgId = admin.organization_id;
      }
      if (!orgId) orgId = organization_id || undefined;
    }

    const orgIds = orgId ? [orgId] : [];
    const orgsById = new Map<string, string>();
    if (orgIds.length > 0) {
      const { data: orgs } = await supabase.from("organizations").select("id, name").in("id", orgIds);
      for (const o of orgs ?? []) orgsById.set(String(o.id), (o.name as string) || "");
    }

    let senderName = "";
    let senderEmail = "";
    let senderPhone = "";
    let senderOrg = "";

    if (raised_by_role === "member" && memberId) {
      const { data: member } = await supabase
        .from("members")
        .select("first_name, last_name, email, phone, organization_id, organizations(name)")
        .eq("id", memberId)
        .maybeSingle();
      if (member) {
        senderName = `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() || "Member";
        senderEmail = (member as Record<string, unknown>).email as string | undefined ?? "";
        senderPhone = (member as Record<string, unknown>).phone as string | undefined ?? "";
        const orgName = (member as Record<string, unknown>).organizations as { name?: string } | null | undefined;
        senderOrg = orgName?.name ?? orgsById.get(String(orgId)) ?? "";
      }
    } else if (raised_by_role === "admin") {
      senderName = "Organization Admin";
      if (orgId) {
        const { data: org } = await supabase.from("organizations").select("name").eq("id", orgId).maybeSingle();
        senderOrg = (org?.name as string | undefined) ?? "";
      }
    } else if (raised_by_role === "superadmin") {
      senderName = "Superadmin";
    }

    const fallbackRaisedBy = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        issue_type,
        description,
        request_callback: !!request_callback,
        raised_by: userId || fallbackRaisedBy,
        raised_by_role: raised_by_role || "member",
        organization_id: orgId,
        member_id: memberId,
        status: "open",
        sender_name: senderName || null,
        sender_email: senderEmail || null,
        sender_phone: senderPhone || null,
        sender_org: senderOrg || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
