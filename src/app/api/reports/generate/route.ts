import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Server-side PDF generation is not available. Use client-side download." },
    { status: 501 }
  );
}
