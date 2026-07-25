import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminOrg } from "@/lib/queries/admin-portal";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { organizationId } = await getAdminOrg();
    const supabase = await createClient();

    const { data: org } = await supabase.from("organizations").select("name").eq("id", organizationId).maybeSingle();

    // Try querying branding fields — gracefully handle missing columns
    let companyName = org?.name ?? "";
    let logoUrl = "";

    try {
      const { data: link } = await supabase
        .from("organization_links")
        .select("branding_company, branding_logo")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (link) {
        if (link.branding_company) companyName = link.branding_company as string;
        if (link.branding_logo) logoUrl = link.branding_logo as string;
      }
    } catch {}

    return NextResponse.json({ companyName, logoUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { organizationId } = await getAdminOrg();
    const supabase = await createClient();
    const { companyName, logoUrl } = await req.json();

    try {
      const { data: existingLink } = await supabase
        .from("organization_links")
        .select("id")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingLink) {
        await supabase.from("organization_links").update({ branding_company: companyName, branding_logo: logoUrl }).eq("id", existingLink.id);
      } else {
        await supabase.from("organizations").update({ branding_company: companyName, branding_logo: logoUrl }).eq("id", organizationId);
      }
    } catch {
      // Columns don't exist yet — return instructions
      return NextResponse.json({ success: false, dbMissing: true, message: "Run supabase/migration_branding.sql in Supabase SQL Editor to enable branding." }, { status: 200 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
