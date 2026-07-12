export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 500 });
  }
  try {
    const { db } = await import("@/db");
    if (!db) {
      return Response.json({ ok: false, error: "Database not initialized" }, { status: 500 });
    }
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
