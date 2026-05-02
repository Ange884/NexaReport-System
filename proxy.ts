/**
 * middleware.ts — Next.js Edge Middleware for route protection
 *
 * Runs on every request BEFORE the page is rendered.
 * This is the primary security gate — it prevents unauthenticated
 * users from reaching protected routes entirely, even before React loads.
 *
 * Strategy:
 *  - Read the access token from the "nexa_access_token" cookie.
 *    (We set this cookie alongside localStorage so middleware can read it.)
 *  - If the token is absent/expired on a protected route → redirect to login.
 *  - If the user is already on a login page but HAS a valid token → redirect
 *    to their dashboard (prevents double-login).
 *
 * NOTE: The middleware cannot call the backend (edge runtime limitations),
 *       so it only checks for the presence of the token. Full validation
 *       (server 401) is handled by the API layer via refresh + redirect.
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

const ADMIN_LOGIN = "/admin/login";
const STUDENT_LOGIN = "/student/login";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startsWithAny(pathname: string, routes: string[]): boolean {
  return routes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("nexa_access_token")?.value ?? null;
}

/**
 * Lightweight check: does the token look non-expired?
 * We decode the JWT exp claim without verifying the signature.
 * Full verification is the backend's responsibility.
 */
function isTokenLikelyValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    if (typeof payload.exp !== "number") return true; // no exp claim → assume valid
    // 30-second buffer before actual expiry
    return Date.now() < payload.exp * 1000 - 30_000;
  } catch {
    return false;
  }
}

// ─── Proxy (route protection) ────────────────────────────────────────────────

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const token = getTokenFromRequest(req);
  const hasValidToken = token ? isTokenLikelyValid(token) : false;

  // ── Guard: admin protected routes ─────────────────────────────────────────
  if (startsWithAny(pathname, ADMIN_PROTECTED)) {
    if (!hasValidToken) {
      const loginUrl = new URL(ADMIN_LOGIN, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Guard: student protected routes ───────────────────────────────────────
  if (startsWithAny(pathname, STUDENT_PROTECTED)) {
    if (!hasValidToken) {
      const loginUrl = new URL(STUDENT_LOGIN, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Already authenticated → skip login pages ──────────────────────────────
  if (hasValidToken) {
    if (pathname === ADMIN_LOGIN) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (pathname === STUDENT_LOGIN) {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// ─── Matcher — only run middleware on routes that need it ─────────────────────

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/student/dashboard",
    "/student/dashboard/:path*",
  ],
};
