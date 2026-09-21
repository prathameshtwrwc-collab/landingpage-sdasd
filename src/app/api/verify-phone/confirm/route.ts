import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, code } = body;

    const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
    const normalizedCode = typeof code === "string" ? code.trim() : "";

    if (!normalizedPhone || !normalizedCode) {
      return NextResponse.json({ error: "Phone and code are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("phone_verifications")
      .select("*")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (error) {
      console.error("phone verification fetch error:", error);
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

    await supabase.from("phone_verifications").update({ verified: true }).eq("phone", normalizedPhone);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("confirm phone verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
