import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10)));
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10));

    const supabase = await createClient();

    let query = supabase
      .from("support_tickets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role && ["member", "admin", "superadmin"].includes(role)) {
      query = query.eq("raised_by_role", role);
    }
    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const tickets = data ?? [];
    const memberIds = tickets.filter(t => t.raised_by_role === "member" && t.member_id).map(t => t.member_id as string);
    const membersMap = new Map<string, Record<string, unknown>>();
    if (memberIds.length > 0) {
      const { data: members } = await supabase
        .from("members")
        .select("id, first_name, last_name, email, phone, organization_id, organizations(name)")
        .in("id", memberIds);
      for (const m of members ?? []) membersMap.set(m.id as string, m);
    }

    const enriched = tickets.map((ticket) => {
      const base = { ...ticket } as Record<string, unknown>;
      if (ticket.raised_by_role === "member" && ticket.member_id) {
        const m = membersMap.get(ticket.member_id as string);
        base.sender_name = m ? `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() : "Member";
        base.sender_email = (m?.email as string | undefined) ?? "";
        base.sender_phone = (m?.phone as string | undefined) ?? "";
        base.sender_org = (m?.organizations as unknown as { name?: string } | null)?.name ?? "";
      } else if (ticket.raised_by_role === "admin") {
        base.sender_name = "Organization Admin";
        base.sender_email = "";
        base.sender_phone = "";
        base.sender_org = "";
      } else {
        base.sender_name = "Superadmin";
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
    const { issue_type, description, request_callback, raised_by_role, organization_id, member_id } = body;

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
        }
      }
      if (!memberId) {
        memberId = body.member_id || undefined;
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
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
