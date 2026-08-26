import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const normalizedCode = typeof code === "string" ? code.trim() : "";

    if (!normalizedEmail || !normalizedCode) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("email verification fetch error:", error);
      return NextResponse.json({ error: "Verification lookup failed" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Verification code not found. Please request a new code." }, { status: 400 });
    }

    if (data.verified) {
      return NextResponse.json({ success: true });
    }

    if (data.code !== normalizedCode) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: "Verification code expired. Please request a new code." }, { status: 400 });
    }

    await supabase.from("email_verifications").update({ verified: true }).eq("email", normalizedEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("confirm verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
