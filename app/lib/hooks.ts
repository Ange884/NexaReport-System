/**
 * hooks.ts — React hooks for auth state & data fetching
 *
 * useAuth      — provides { user, isLoading, isAuthenticated, logout }
 * useCurrentUser — fetches the live user profile from the backend
 * useDashboard — fetches the dashboard data
 * useNotifications — fetches notifications with unread count
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  isAuthenticated,
  getCurrentUser,
  clearSession,
  setupSession,
} from "./auth";
import {
  getCurrentUser as fetchUserFromApi,
  logoutUser,
  fetchDashboard,
  fetchMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./api";
import type {
  UserResponse,
  DashboardResponse,
  NotificationResponseDto,
} from "./types";
import { getDefaultRoute } from "./types";

// ─── useAuth ──────────────────────────────────────────────────────────────────

export interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Logs the user out: calls backend, clears session, redirects to login. */
  logout: () => Promise<void>;
  /** Refreshes the cached user from the backend. */
  refreshUser: () => Promise<void>;
}

/**
 * Core auth hook. Reads from localStorage cache first (instant),
 * then validates with a live /api/users/profile call.
 *
 * Usage: const { user, isLoading, logout } = useAuth();
 */
export function useAuth(): AuthState {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(() =>
    getCurrentUser()
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const fresh = await fetchUserFromApi();
      // Re-persist so the cache is always current
      setupSession(
        localStorage.getItem("nexa_access_token") ?? "",
        fresh
      );
      setUser(fresh);
    } catch {
      // If we can't validate the user, clear the session
      clearSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // If there's no token at all, skip the API call
    if (!isAuthenticated()) {
      // Use cached user if it exists, but mark not loading
      setIsLoading(false);
      return;
    }
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Always clear client-side session even if backend call fails
    } finally {
      const currentUser = user;
      clearSession();
      setUser(null);
      // Route to appropriate login page
      if (currentUser) {
        import("./types").then(({ isAdminRole }) => {
          router.push(isAdminRole(currentUser.role) ? "/admin/login" : "/student/login");
        });
      } else {
        router.push("/");
      }
    }
  }, [router, user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && isAuthenticated(),
    logout,
    refreshUser,
  };
}

// ─── useRequireAuth ───────────────────────────────────────────────────────────

interface RequireAuthOptions {
  /** Which role group to require. Unauthenticated/wrong-role users are redirected. */
  requiredGroup?: "admin" | "student" | "any";
}

/**
 * Use this in protected page components.
 * Redirects to the appropriate login page if auth check fails.
 *
 * Returns the same shape as useAuth plus a `ready` flag.
 */
export function useRequireAuth(
  options: RequireAuthOptions = { requiredGroup: "any" }
): AuthState & { ready: boolean } {
  const auth = useAuth();
  const router = useRouter();
  const { requiredGroup = "any" } = options;

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated || !auth.user) {
      // Decide which login to redirect to based on URL
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        router.replace(
          path.startsWith("/admin") ? "/admin/login" : "/student/login"
        );
      }
      return;
    }

    // Role-based guard
    if (requiredGroup !== "any") {
      import("./types").then(({ isAdminRole, isStudentRole }) => {
        const role = auth.user!.role;
        if (requiredGroup === "admin" && !isAdminRole(role)) {
          router.replace(getDefaultRoute(role));
        } else if (requiredGroup === "student" && !isStudentRole(role)) {
          router.replace(getDefaultRoute(role));
        }
      });
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, requiredGroup, router]);

  return { ...auth, ready: !auth.isLoading && auth.isAuthenticated };
}

// ─── useDashboard ─────────────────────────────────────────────────────────────

export interface DashboardState {
  data: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the dashboard summary from GET /api/dashboard.
 */
export function useDashboard(): DashboardState {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await fetchDashboard());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch: load };
}

// ─── useNotifications ─────────────────────────────────────────────────────────

export interface NotificationsState {
  notifications: NotificationResponseDto[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  refetch: () => void;
}

/**
 * Fetches notifications and provides mark-as-read helpers.
 * Auto-polls every 60 seconds while the page is active.
 */
export function useNotifications(pollInterval = 60_000): NotificationsState {
  const [notifications, setNotifications] = useState<
    NotificationResponseDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setNotifications(await fetchMyNotifications());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, pollInterval);
    return () => clearInterval(interval);
  }, [load, pollInterval]);

  const markRead = useCallback(
    async (id: number) => {
      try {
        await markNotificationRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      } catch {
        // Silently ignore — we'll refetch next poll
      }
    },
    []
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Silently ignore
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markRead,
    markAllRead,
    refetch: load,
  };
}
