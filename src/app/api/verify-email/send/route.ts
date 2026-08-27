import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabase.from("email_verifications").upsert({
      email: normalizedEmail,
      code,
      expires_at: expiresAt,
      verified: false,
    }, { onConflict: "email" });

    if (error) {
      console.error("email verification save error:", error);
      return NextResponse.json({ error: "Failed to save verification code" }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const fromName = process.env.RESEND_FROM_NAME || "Chronotype Sleep Wellness";

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured — OTP not emailed.");
      return NextResponse.json({ success: true });
    }

    if (!fromEmail) {
      console.error("RESEND_FROM_EMAIL is not configured.");
      return NextResponse.json({ error: "Email service is not configured. Please contact support." }, { status: 500 });
    }

    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: normalizedEmail,
          subject: "Your Chronotype Verification Code",
          html: `
            <div style="font-family: Poppins, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #171717;">
              <h2 style="color: #35319B; margin-bottom: 8px;">Verify your email</h2>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                Use the following 6-digit code to verify your email address:
              </p>
              <div style="background: #F8F9FF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: 700; letter-spacing: 6px; color: #35319B;">${code}</span>
              </div>
              <p style="color: #888; font-size: 13px;">
                This code expires in 10 minutes. If you did not request this, please ignore this email.
              </p>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const resendText = await resendRes.text();
        console.error("Resend email error:", resendRes.status, resendText);
        return NextResponse.json({ error: `Failed to send email: ${resendRes.status} ${resendText}` }, { status: 502 });
      }
    } catch (emailError) {
      console.error("Resend email exception:", emailError);
      return NextResponse.json({ error: emailError instanceof Error ? emailError.message : "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
