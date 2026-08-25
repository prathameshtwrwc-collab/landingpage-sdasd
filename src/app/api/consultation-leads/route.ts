import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fname, lname, age, gender, maritalStatus, country, state, city, pincode, email, phone, scheduleDate, scheduleTime } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(scheduleDate + "T00:00:00");
    if (selectedDate < today) {
      return NextResponse.json({ error: "Consultation date cannot be in the past." }, { status: 400 });
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    maxDate.setHours(0, 0, 0, 0);
    if (selectedDate > maxDate) {
      return NextResponse.json({ error: "Consultation date cannot be more than 90 days in the future." }, { status: 400 });
    }

    const { error } = await supabase.from("consultation_leads").insert({
      fname,
      lname,
      age,
      gender,
      marital_status: maritalStatus,
      country,
      state,
      city,
      pincode,
      email,
      phone,
      schedule_date: scheduleDate,
      schedule_time: scheduleTime,
      status: "PENDING",
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") || undefined;
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "10", 10)));
    const status = url.searchParams.get("status") || undefined;
    const search = url.searchParams.get("search") || undefined;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = email
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
        )
      : createAdminClient();

    let query = supabase
      .from("consultation_leads")
      .select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    if (email) {
      query = query.eq("email", email);
    } else if (search) {
      query = query.or(`fname.ilike.%${search}%,lname.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id, status, notes, consultedBy, consultNotes } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // "Consult this patient" — record who consulted + the consult notes,
    // timestamp it, and move a pending lead to CONTACTED.
    if (consultedBy !== undefined || consultNotes !== undefined) {
      if (consultedBy !== undefined) updateData.consulted_by = consultedBy;
      if (consultNotes !== undefined) updateData.consult_notes = consultNotes;
      updateData.consulted_at = new Date().toISOString();
      if (!status) updateData.status = "CONTACTED";
    }

    const { error } = await supabase.from("consultation_leads").update(updateData).eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const supabase = createAdminClient();

    const { error } = await supabase.from("consultation_leads").delete().eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}