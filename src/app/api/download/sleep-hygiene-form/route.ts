import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "pdfs", "sleep hygiene form.pdf");
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"sleep-hygiene-form.pdf\"",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
