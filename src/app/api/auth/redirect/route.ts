import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapClerkRole } from "@/lib/auth/roles";

// This route is called after Clerk client-side sign-in completes.
// It reads the query param role passed from the login component.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = mapClerkRole(searchParams.get("role"));

  switch (role) {
    case "superadmin":
      return NextResponse.redirect(new URL("/superadmin/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
    case "organization_admin":
      return NextResponse.redirect(new URL("/admin/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
    case "member":
      return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
    default:
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }
}
