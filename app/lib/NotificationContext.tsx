"use client";

/**
 * NotificationContext
 *
 * Single source of truth for notifications across the entire app.
 * Wrap the admin and student layouts with this provider so that:
 *  - The layout bell badge, the dashboard panel, and the notifications page
 *    all share ONE polling instance — no duplicates, no conflicts.
 *
 * Usage:
 *   <NotificationProvider>...</NotificationProvider>
 *   const { notifications, unreadCount, markRead, markAllRead } = useNotificationContext();
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/app/lib/api";
import type { NotificationResponseDto } from "@/app/lib/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface NotificationContextValue {
  notifications: NotificationResponseDto[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 60_000; // 1 minute

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const intervalRef                       = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    // Don't set isLoading on background polls — avoids flicker
    setError(null);
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
    } catch (e: unknown) {
      // Only show error on first load; silently ignore background poll failures
      setError(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  const markRead = useCallback(async (id: number) => {
    // Optimistic update first
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch {
      // Revert on failure — re-fetch from server
      load();
    }
  }, [load]);

  const markAllRead = useCallback(async () => {
    // Optimistic update first
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // Revert on failure
      load();
    }
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        markRead,
        markAllRead,
        refetch: load,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used inside <NotificationProvider>"
    );
  }
  return ctx;
}
