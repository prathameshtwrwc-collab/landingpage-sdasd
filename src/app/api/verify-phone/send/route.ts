import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;

    const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
    if (!normalizedPhone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabase.from("phone_verifications").upsert({
      phone: normalizedPhone,
      code,
      expires_at: expiresAt,
      verified: false,
    }, { onConflict: "phone" });

    if (error) {
      console.error("phone verification save error:", error);
      return NextResponse.json({ error: "Failed to save verification code" }, { status: 500 });
    }

    const apiKey = process.env.HANU_OTP_API_KEY;
    if (!apiKey) {
      console.warn("HANU_OTP_API_KEY not configured — OTP not sent.");
      return NextResponse.json({ success: true });
    }

    try {
      const rawPhone = normalizedPhone.replace(/^\+/, "");
      const tenDigit = rawPhone.replace(/^91/, "").replace(/\D/g, "");
      const url = new URL("https://api.hanuotp.in/sms-otp.php");
      url.searchParams.set("number", tenDigit);
      url.searchParams.set("OTP", code);
      url.searchParams.set("apikey", apiKey);
      url.searchParams.set("templatesid", "61584674");

      const resendRes = await fetch(url.toString(), { method: "GET" });

      const responseText = await resendRes.text();
      console.log("HanuOTP status:", resendRes.status, "response:", responseText);

      if (!resendRes.ok) {
        console.error("HanuOTP error:", resendRes.status, responseText);
        return NextResponse.json({ error: `Failed to send OTP: ${resendRes.status}` }, { status: 502 });
      }
    } catch (smsError) {
      console.error("HanuOTP exception:", smsError);
      return NextResponse.json({ error: smsError instanceof Error ? smsError.message : "Failed to send OTP" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send phone verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
