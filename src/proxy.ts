import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/superadmin/login(.*)",
  "/unauthorized",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/app",
  "/super",
  "/dashboard(.*)",
  "/api/auth(.*)",
  "/api/webhooks(.*)",
  "/api/health",
  "/api/member(.*)",
  "/api/org-link-status(.*)",
]);

// Paths that always require auth
const protectedPrefixes = ["/admin", "/superadmin", "/api/admin", "/api/admin-org"];

export default clerkMiddleware(
  async (auth, request) => {
    if (isPublicRoute(request)) return;

    const pathname = request.nextUrl.pathname;

    // Only protect known admin/superadmin routes; everything else is public
    const needsProtection = protectedPrefixes.some(
      (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?")
    );

    if (!needsProtection) return;

    await auth.protect();
  },
  { signInUrl: "/login" }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
