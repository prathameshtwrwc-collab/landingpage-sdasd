import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type WebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();
  let event: WebhookEvent;

  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data as Record<string, unknown>;
    const email = (email_addresses as Array<{ email_address: string }>)?.[0]?.email_address;
    const clerkUserId = id as string;

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: existingMember } = await supabase
      .from("members")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingMember) {
      await supabase
        .from("members")
        .update({ clerk_user_id: clerkUserId })
        .eq("id", existingMember.id);
    } else {
      await supabase.from("members").insert({
        clerk_user_id: clerkUserId,
        first_name: (first_name as string) || email.split("@")[0],
        last_name: (last_name as string) || "",
        email,
        age: "",
        phone: "",
        source_type: "DIRECT",
      });
    }

    // Also link organization_admins by email
    const { data: existingAdmin } = await supabase
      .from("organization_admins")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingAdmin) {
      await supabase
        .from("organization_admins")
        .update({ clerk_user_id: clerkUserId })
        .eq("id", existingAdmin.id);
    }
  }

  return NextResponse.json({ ok: true });
}
