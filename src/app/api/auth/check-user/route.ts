import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let supabase;
    try {
      supabase = await createClient();
    } catch (err) {
      return NextResponse.json({ error: `Supabase connection failed: ${err instanceof Error ? err.message : "Check env vars"}` }, { status: 500 });
    }

    // Check members table
    const { data: member, error: memberErr } = await supabase
      .from("members")
      .select("id, first_name, last_name, email, organization_id")
      .eq("email", email)
      .maybeSingle();

    if (memberErr && memberErr.message?.includes("relation")) {
      return NextResponse.json({ error: "Database tables not found. Run supabase/schema.sql, schema2.sql, schema3.sql in order." }, { status: 500 });
    }
    if (memberErr) {
      return NextResponse.json({ error: `DB error: ${memberErr.message}` }, { status: 500 });
    }

    if (member) {
      return NextResponse.json({ exists: true, role: "member", member });
    }

    // Check organization_admins table
    const { data: admin, error: adminErr } = await supabase
      .from("organization_admins")
      .select("id, first_name, last_name, email, organization_id, role")
      .eq("email", email)
      .maybeSingle();

    if (adminErr && !adminErr.message?.includes("relation")) {
      return NextResponse.json({ error: `DB error: ${adminErr.message}` }, { status: 500 });
    }

    if (admin) {
      return NextResponse.json({ exists: true, role: admin.role === "superadmin" ? "superadmin" : "admin", admin });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    return NextResponse.json({ error: `Server error: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
