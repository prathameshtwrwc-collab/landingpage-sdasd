import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULTS = {
  platform: { name: "Chronotype", supportEmail: "support@chronotype.com", defaultOrgType: "Corporate", timezone: "UTC", currency: "USD" },
  scoring: { maxPossibleScore: 40, owlMin: 0, owlMax: 13, eagleMin: 14, eagleMax: 26, larkMin: 27, larkMax: 40 },
  assessment: { defaultQuestionsCount: 11, requireEmail: true, allowAnonymous: true },
  notifications: { newOrgAlert: true, newMemberAlert: true, dailyDigest: false, adminEmail: "" },
};

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = await createClient();
    const { data, error } = await supabase.from("platform_settings").select("key, value");

    if (error && error.message.includes("relation")) {
      return NextResponse.json({ settings: DEFAULTS, dbMissing: true });
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const settings = { ...DEFAULTS };
    (data ?? []).forEach((r) => { if (r.key in settings) (settings as Record<string, unknown>)[r.key] = r.value; });

    return NextResponse.json({ settings, dbMissing: false });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const supabase = await createClient();
    const body = await req.json();
    const { key, value } = body;

    if (!key || !value) return NextResponse.json({ error: "key and value required" }, { status: 400 });

    const { error } = await supabase.from("platform_settings").upsert(
      { key, value: typeof value === "object" ? JSON.stringify(value) : value },
      { onConflict: "key" }
    );

    if (error && error.message.includes("relation")) {
      // Table doesn't exist - just return success since we'll use client-side fallback
      return NextResponse.json({ success: true, dbMissing: true });
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, dbMissing: false });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
