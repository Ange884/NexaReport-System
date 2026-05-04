/**
 * middleware.ts — Next.js Edge Middleware for route protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route groups ─────────────────────────────────────────────────────────────

const ADMIN_PROTECTED = [
  "/admin",
  "/admin/manage-issues",
  "/admin/send-invite",
  "/admin/notifications",
  "/admin/archive",
  "/admin/profile",
  "/admin/system-activity",
];

const STUDENT_PROTECTED = ["/student/dashboard"];

const LOGIN_PATH = "/login";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startsWithAny(pathname: string, routes: string[]): boolean {
  return routes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("nexa_access_token")?.value ?? null;
}

function isTokenLikelyValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    if (typeof payload.exp !== "number") return true; 
    return Date.now() < payload.exp * 1000 - 30_000;
  } catch {
    return false;
  }
}

// ─── Middleware ──────────────────────────────────────────────────────────────

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const token = getTokenFromRequest(req);
  const hasValidToken = token ? isTokenLikelyValid(token) : false;

  // Ignore the login page itself to avoid loops
  if (pathname === LOGIN_PATH) {
    if (hasValidToken) {
       // Optional: Redirect to dashboard if already logged in
       // return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // ── Guard: admin protected routes ─────────────────────────────────────────
  if (startsWithAny(pathname, ADMIN_PROTECTED)) {
    if (!hasValidToken) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Guard: student protected routes ───────────────────────────────────────
  if (startsWithAny(pathname, STUDENT_PROTECTED)) {
    if (!hasValidToken) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/dashboard/:path*",
  ],
};
