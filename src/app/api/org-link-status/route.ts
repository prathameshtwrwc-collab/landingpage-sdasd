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
      .select("active, organization_id")
      .eq("unique_code", code.toUpperCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return NextResponse.json({ exists: false });
    return NextResponse.json({ exists: true, active: data.active, organizationId: data.organization_id });
  } catch {
    return NextResponse.json({ exists: false, error: "Failed to check link" }, { status: 500 });
  }
}
