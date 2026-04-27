/**
 * auth.ts — Secure token management utilities
 *
 * Strategy:
 *  - Access token  → localStorage + a JS-readable cookie (SameSite=Strict)
 *    The cookie is read by the Next.js edge middleware for server-side route
 *    protection without a network round-trip. localStorage is the primary
 *    client-side store for the token.
 *  - Refresh token → HttpOnly cookie set exclusively by the backend.
 *  - User info     → localStorage (re-validated on every protected page load)
 *
 * All keys are prefixed with "nexa_" to avoid collisions.
 */

import type { UserResponse, UserRole } from "./types";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "nexa_access_token";
const USER_KEY = "nexa_user";
const TOKEN_EXPIRY_KEY = "nexa_token_expiry";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ─── Access Token ─────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature
 * (verification happens server-side; we only need the expiry & claims client-side).
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Get the access token from localStorage. */
export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** Persist the access token and record when it expires. */
export function setAccessToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);

  // Try to extract expiry from JWT so we can detect staleness client-side.
  const payload = decodeJwtPayload(token);
  let maxAge = 15 * 60; // default 15 minutes
  if (payload && typeof payload.exp === "number") {
    // exp is Unix seconds → convert to ms
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(payload.exp * 1000));
    maxAge = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  }

  // Mirror to a JS-accessible cookie for the edge middleware.
  // SameSite=Strict prevents CSRF. Not HttpOnly so JS can manage it.
  document.cookie = [
    `nexa_access_token=${encodeURIComponent(token)}`,
    `max-age=${maxAge}`,
    "path=/",
    "SameSite=Strict",
    // Add Secure flag when on HTTPS
    ...(location.protocol === "https:" ? ["Secure"] : []),
  ].join("; ");
}

/** Remove the access token and the mirror cookie (used during logout). */
export function removeAccessToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  // Expire the cookie immediately
  document.cookie =
    "nexa_access_token=; max-age=0; path=/; SameSite=Strict";
}

/** True when an access token exists AND hasn't expired client-side. */
export function isAccessTokenValid(): boolean {
  if (!isBrowser()) return false;
  const token = getAccessToken();
  if (!token) return false;

  const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryStr) return true; // no expiry info — treat as valid

  const expiry = Number(expiryStr);
  // Add a 30-second buffer so we refresh just before actual expiry.
  return Date.now() < expiry - 30_000;
}

/** True when the access token exists but HAS expired (time to refresh). */
export function isAccessTokenExpired(): boolean {
  if (!isBrowser()) return false;
  const token = getAccessToken();
  if (!token) return false;
  return !isAccessTokenValid();
}

// ─── User Session ──────────────────────────────────────────────────────────────

/** Persist the logged-in user object. */
export function setCurrentUser(user: UserResponse): void {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Retrieve the cached user object from localStorage. */
export function getCurrentUser(): UserResponse | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserResponse;
  } catch {
    return null;
  }
}

/** Remove the cached user object. */
export function removeCurrentUser(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(USER_KEY);
}

// ─── Session Management ───────────────────────────────────────────────────────

/** True when the user appears to be logged in (token present & not expired). */
export function isAuthenticated(): boolean {
  return isAccessTokenValid();
}

/** Get the user's role from the cached user object. */
export function getUserRole(): UserRole | null {
  const user = getCurrentUser();
  return user?.role ?? null;
}

/**
 * Clear everything — called on logout.
 * The refresh-token cookie is cleared by the backend's /api/auth/logout endpoint.
 */
export function clearSession(): void {
  removeAccessToken();
  removeCurrentUser();
}

/**
 * Full login session setup — called after a successful login response.
 */
export function setupSession(accessToken: string, user: UserResponse): void {
  setAccessToken(accessToken);
  setCurrentUser(user);
}
