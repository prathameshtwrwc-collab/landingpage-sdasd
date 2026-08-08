import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) return NextResponse.json({ exists: false }, { status: 400 });
    const supabase = await createClient();
    const { data } = await supabase
      .from("organization_links")
      .select("active, organization_id, branding_logo, branding_company")
      .eq("unique_code", code.toUpperCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return NextResponse.json({ exists: false }, { headers: CACHE });

    // Fallback: get org name if branding_company is empty
    let companyName = data.branding_company ?? "";
    let logoUrl = data.branding_logo ?? "";
    if (!companyName) {
      const { data: org } = await supabase.from("organizations").select("name").eq("id", data.organization_id).maybeSingle();
      companyName = org?.name ?? "";
    }

    return NextResponse.json({ exists: true, active: data.active, organizationId: data.organization_id, brandingCompany: companyName, brandingLogo: logoUrl }, { headers: CACHE });
  } catch {
    return NextResponse.json({ exists: false, error: "Failed to check link" }, { status: 500 });
  }
}

const CACHE = { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" };
