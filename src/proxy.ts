import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

/**
 * Optimistic gate for /admin — signature check on the cookie only, no database
 * call, because the proxy runs on every matched request including prefetches.
 *
 * This is a redirect convenience, NOT the security boundary: Server Actions are
 * POSTs to the page they live on and are not reliably covered here. Every
 * protected page and action calls `requireAdmin()` itself.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const signedIn = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value) !== null;

  if (!signedIn && !isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  if (signedIn && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
