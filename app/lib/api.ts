/**
 * api.ts — Centralized API abstraction layer for NexaReport
 *
 * All backend communication goes through this file.
 * Components never call fetch() directly — they call these functions.
 *
 * Features:
 *  - Automatic Authorization header injection
 *  - Transparent token refresh on 401 (single retry)
 *  - Auto-logout when refresh fails
 *  - Typed request/response pairs matching backend DTOs exactly
 */

import {
  getAccessToken,
  setAccessToken,
  clearSession,
  isAccessTokenExpired,
} from "./auth";
import type {
  AuthResponse,
  AccessTokenResponse,
  LoginRequest,
  ChangePasswordRequest,
  DashboardResponse,
  IssueResponseDto,
  IssueDashboardResponse,
  IssueCreateRequest,
  IssueEditRequest,
  IssueCommentRequest,
  IssueResolveRequest,
  IssueThreadResponse,
  AssignIssueRequest,
  PriorityUnresolvedCountResponse,
  NotificationResponseDto,
  InviteUserRequest,
  InviteUserResult,
  UserResponse,
  MessageResponse,
} from "./types";

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = "https://nexoreport.onrender.com";

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Skip the Authorization header (used for /api/auth/login and /api/auth/refresh) */
  skipAuth?: boolean;
  /** Include cookies (needed for refresh token cookie round-trips) */
  withCredentials?: boolean;
}

/**
 * Internal fetch helper.
 * Automatically:
 *  1. Attaches the Bearer token unless skipAuth is set.
 *  2. Serialises the body to JSON.
 *  3. Parses and throws structured error messages from the backend.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, skipAuth = false, withCredentials = false } =
    options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: withCredentials ? "include" : "same-origin",
  });

  // Empty body (e.g. 204 No Content)
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const msg =
      (data as { message?: string })?.message ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}

/**
 * Fetch wrapper with automatic token refresh on 401.
 * If the access token is expired we try to refresh first.
 * If the token is still valid but the server returns 401, we refresh once
 * and retry. If that also fails we clear the session and throw.
 */
async function authorizedRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  // Proactively refresh if the token looks expired
  if (isAccessTokenExpired()) {
    try {
      await refreshTokens();
    } catch {
      // If proactive refresh fails, clear session and throw
      clearSession();
      redirectToLogin();
      throw new ApiError("Session expired. Please log in again.", 401);
    }
  }

  try {
    return await request<T>(path, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      // Try one refresh + retry
      try {
        await refreshTokens();
        return await request<T>(path, options);
      } catch {
        clearSession();
        redirectToLogin();
        throw new ApiError("Session expired. Please log in again.", 401);
      }
    }
    throw err;
  }
}

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    // Detect which portal the user is in
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/student/login";
    }
  }
}

// ─── Error class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Authenticates user and returns access token + user info.
 * The backend also sets an HttpOnly refreshToken cookie automatically.
 */
export async function loginUser(
  credentials: LoginRequest
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
    skipAuth: true,
    withCredentials: true, // needed for the refresh-token cookie to be set
  });
}

/**
 * POST /api/auth/refresh
 * Uses the HttpOnly cookie (sent automatically by the browser).
 * Returns a new access token.
 */
export async function refreshTokens(): Promise<AccessTokenResponse> {
  const res = await request<AccessTokenResponse>("/api/auth/refresh", {
    method: "POST",
    skipAuth: true,
    withCredentials: true, // sends the refreshToken cookie
  });
  // Persist the new access token
  setAccessToken(res.accessToken);
  return res;
}

/**
 * POST /api/auth/logout
 * Invalidates the refresh token server-side and clears the cookie.
 */
export async function logoutUser(): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>("/api/auth/logout", {
    method: "POST",
    withCredentials: true,
  });
}

// ─── User / Profile endpoints ─────────────────────────────────────────────────

/**
 * GET /api/dashboard
 * Returns the summary dashboard data for the authenticated user.
 */
export async function fetchDashboard(): Promise<DashboardResponse> {
  return authorizedRequest<DashboardResponse>("/api/dashboard");
}

// ─── User Management endpoints ────────────────────────────────────────────────

/**
 * GET /api/users/profile
 * Returns the current authenticated user's full profile.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return authorizedRequest<UserResponse>("/api/users/profile");
}

/**
 * PUT /api/users/password
 * Updates the current user's password.
 */
export async function updatePassword(
  payload: ChangePasswordRequest
): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>("/api/users/password", {
    method: "PUT",
    body: payload,
  });
}

/**
 * POST /api/users/invite
 * Invites a new user (admin/staff roles only).
 */
export async function inviteUser(
  payload: InviteUserRequest
): Promise<InviteUserResult> {
  return authorizedRequest<InviteUserResult>("/api/users/invite", {
    method: "POST",
    body: payload,
  });
}

/**
 * POST /api/users/resend-invitation/:userId
 */
export async function resendInvitation(
  userId: number
): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>(
    `/api/users/resend-invitation/${userId}`,
    { method: "POST" }
  );
}

/**
 * DELETE /api/users/:userId
 * Soft-deletes a user (deactivates account).
 */
export async function deleteUser(userId: number): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

/**
 * GET /api/users/by-role/:role
 * Returns all users with the given role.
 */
export async function fetchUsersByRole(role: string): Promise<UserResponse[]> {
  return authorizedRequest<UserResponse[]>(
    `/api/users/by-role/${encodeURIComponent(role)}`
  );
}

// ─── Dashboard endpoint ───────────────────────────────────────────────────────

/**
 * GET /api/dashboard
 * Returns statistics and recent activity for the current user's dashboard.
 */
// export async function fetchDashboard(): Promise<DashboardResponse> {
//   return authorizedRequest<DashboardResponse>("/api/dashboard");
// }

// ─── Issue endpoints ──────────────────────────────────────────────────────────

/**
 * POST /api/issues/create
 */
export async function createIssue(
  payload: IssueCreateRequest
): Promise<IssueResponseDto> {
  return authorizedRequest<IssueResponseDto>("/api/issues/create", {
    method: "POST",
    body: payload,
  });
}

/**
 * GET /api/issues/my
 * Sender's dashboard — issues the current user created.
 */
export async function fetchMyIssues(): Promise<IssueDashboardResponse> {
  return authorizedRequest<IssueDashboardResponse>("/api/issues/my");
}

/**
 * GET /api/issues/received
 * Receiver's dashboard — issues targeted at the current user/role.
 */
export async function fetchReceivedIssues(): Promise<IssueDashboardResponse> {
  return authorizedRequest<IssueDashboardResponse>("/api/issues/received");
}

/**
 * GET /api/issues/:id/thread
 * Full thread: issue + comments + activity log.
 */
export async function fetchIssueThread(
  id: number
): Promise<IssueThreadResponse> {
  return authorizedRequest<IssueThreadResponse>(`/api/issues/${id}/thread`);
}

/**
 * PUT /api/issues/:id/edit
 */
export async function editIssue(
  id: number,
  payload: IssueEditRequest
): Promise<IssueResponseDto> {
  return authorizedRequest<IssueResponseDto>(`/api/issues/${id}/edit`, {
    method: "PUT",
    body: payload,
  });
}

/**
 * POST /api/issues/:id/comment
 */
export async function commentOnIssue(
  id: number,
  payload: IssueCommentRequest
): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>(`/api/issues/${id}/comment`, {
    method: "POST",
    body: payload,
  });
}

/**
 * POST /api/issues/:id/resolve
 * Staff roles only.
 */
export async function resolveIssue(
  id: number,
  payload: IssueResolveRequest
): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>(`/api/issues/${id}/resolve`, {
    method: "POST",
    body: payload,
  });
}

/**
 * POST /api/issues/:id/resend
 * Duplicates an issue as a new PENDING issue.
 */
export async function resendIssue(
  id: number
): Promise<IssueResponseDto> {
  return authorizedRequest<IssueResponseDto>(`/api/issues/${id}/resend`, {
    method: "POST",
  });
}

/**
 * GET /api/issues/category/:category
 */
export async function fetchIssuesByCategory(
  category: string
): Promise<IssueResponseDto[]> {
  return authorizedRequest<IssueResponseDto[]>(
    `/api/issues/category/${encodeURIComponent(category)}`
  );
}

/**
 * GET /api/issues/broadcast
 * Public broadcast feed — no auth required but we send token if present.
 */
export async function fetchBroadcastFeed(): Promise<IssueResponseDto[]> {
  return authorizedRequest<IssueResponseDto[]>("/api/issues/broadcast");
}

/**
 * GET /api/issues/resolved
 * Staff roles only.
 */
export async function fetchResolvedIssues(): Promise<IssueResponseDto[]> {
  return authorizedRequest<IssueResponseDto[]>("/api/issues/resolved");
}

/**
 * GET /api/issues/pending
 * Staff roles only.
 */
export async function fetchPendingIssues(): Promise<IssueResponseDto[]> {
  return authorizedRequest<IssueResponseDto[]>("/api/issues/pending");
}

/**
 * GET /api/issues/in-progress
 * Staff roles only.
 */
export async function fetchInProgressIssues(): Promise<IssueResponseDto[]> {
  return authorizedRequest<IssueResponseDto[]>("/api/issues/in-progress");
}

/**
 * GET /api/issues/priority/unresolved/count
 * Admin/staff roles only.
 */
export async function fetchPriorityUnresolvedCount(): Promise<PriorityUnresolvedCountResponse> {
  return authorizedRequest<PriorityUnresolvedCountResponse>(
    "/api/issues/priority/unresolved/count"
  );
}

/**
 * POST /api/issues/:issueId/assign
 * Admin only.
 */
export async function assignIssue(
  issueId: number,
  payload: AssignIssueRequest
): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>(`/api/issues/${issueId}/assign`, {
    method: "POST",
    body: payload,
  });
}

// ─── Notification endpoints ───────────────────────────────────────────────────

/**
 * GET /api/notifications/my
 */
export async function fetchMyNotifications(): Promise<
  NotificationResponseDto[]
> {
  return authorizedRequest<NotificationResponseDto[]>("/api/notifications/my");
}

/**
 * POST /api/notifications/:id/read
 */
  export async function markNotificationRead(
    id: number
  ): Promise<MessageResponse> {
    return authorizedRequest<MessageResponse>(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  }

/**
 * POST /api/notifications/read-all
 */
export async function markAllNotificationsRead(): Promise<MessageResponse> {
  return authorizedRequest<MessageResponse>("/api/notifications/read-all", {
    method: "POST",
  });
}

// ─── Legacy alias (keeps old imports working) ─────────────────────────────────
export { loginUser as loginStudent };

// ─── System monitoring endpoints ─────────────────────────────────────────────

export interface SystemActivityItem {
  date: string;
  resolvedCount: number;
}

export interface PrioritySummary {
  priorityUnresolvedTotal: number;
  overduePriorityTotal: number;
}

/**
 * GET /api/system/activity
 * Returns resolved issues per day (admin/staff only).
 */
export async function fetchSystemActivity(): Promise<SystemActivityItem[]> {
  return authorizedRequest<SystemActivityItem[]>("/api/system/activity");
}

/**
 * GET /api/system/priority-summary
 * Returns priority unresolved + overdue counts (admin/staff only).
 */
export async function fetchPrioritySummary(): Promise<PrioritySummary> {
  return authorizedRequest<PrioritySummary>("/api/system/priority-summary");
}