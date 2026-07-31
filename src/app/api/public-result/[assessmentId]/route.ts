import { NextResponse } from "next/server";
import { fetchPublicResult } from "@/lib/queries/public-result";

export async function GET(_request: Request, { params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;

  const data = await fetchPublicResult(assessmentId);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
