import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { buildReportHtml } = await import("@/lib/report-template");
    const html = buildReportHtml(data);
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate report preview" }, { status: 500 });
  }
}
