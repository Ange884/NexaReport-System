"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/lib/hooks";
import { NotificationProvider, useNotificationContext } from "@/app/lib/NotificationContext";
import { isAdminRole } from "@/app/lib/types";

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  {
    href: "/admin", label: "Dashboard", exact: true, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    )
  },
  {
    href: "/admin/manage-issues", label: "Issues", exact: false, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
    )
  },
  {
    href: "/admin/send-invite", label: "Send Invitation", exact: false, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
    )
  },
  {
    href: "/admin/notifications", label: "Alerts", exact: false, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
    )
  },
  {
    href: "/admin/archive", label: "History", exact: false, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
    )
  },
  {
    href: "/admin/profile", label: "Profile", exact: false, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )
  },
];

// ─── Header search (needs Suspense for useSearchParams) ───────────────────────

function AdminHeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="relative group">
      <input
        type="text"
        defaultValue={searchParams.get("q") || ""}
        placeholder="Search issues, reporters..."
        className="w-64 rounded-full bg-[var(--background)] border border-transparent px-10 py-2.5 text-sm font-medium outline-none transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[#21130D]/20 group-hover:bg-white group-hover:border-[var(--border)]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = (e.target as HTMLInputElement).value;
            router.push(`/admin/manage-issues?q=${encodeURIComponent(val)}`);
          }
        }}
      />
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
    </div>
  );
}

// ─── Notification bell with live badge ────────────────────────────────────────

function NotificationBell() {
  const { unreadCount } = useNotificationContext();
  return (
    <Link href="/admin/notifications">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--muted)] transition hover:text-[var(--accent)] hover:bg-white hover:border border-[var(--border)] cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function AuthLoadingSkeleton() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#21130D] text-white shadow-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-[#e2e8f0]">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-[#21130D]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#a0aec0]">
          Loading portal...
        </p>
      </div>
    </div>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Allow login page to render without auth guard
  const isLoginPage = pathname === "/admin/login";

  // Client-side auth guard (middleware covers SSR; this covers CSR nav)
  useEffect(() => {
    if (isLoginPage) return;
    if (isLoading) return;

    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role guard: only admin-tier roles can be in the admin section
    if (!isAdminRole(user.role)) {
      import("@/app/lib/types").then(({ getDefaultRoute }) => {
        router.replace(getDefaultRoute(user.role));
      });
    }
  }, [isLoginPage, isLoading, user, pathname, router]);

  // Render login page without the dashboard shell
  if (isLoginPage) return <>{children}</>;

  // Show loading skeleton while verifying auth
  if (isLoading) return <AuthLoadingSkeleton />;

  // While redirecting, show nothing to avoid a flash
  if (!user || !isAdminRole(user.role)) return null;

  // Derive a display name from the email (before the @)
  const displayName = user.email.split("@")[0];
  const roleLabel = user.role.replace(/_/g, " ");

  function isActive(item: (typeof navItems)[0]): boolean {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <NotificationProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="animate-sidebar sticky top-0 hidden h-full w-64 flex-col border-r border-[var(--border)] bg-white p-6 md:flex overflow-y-auto">
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-[var(--accent)]">
            NEXAREPORT
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-bold transition-all duration-200 ${
                isActive(item)
                  ? "bg-[var(--accent)] text-white shadow-lg shadow-[#21130D]/40"
                  : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User card + Logout */}
        <div className="mt-6 border-t border-[var(--border)] pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-black text-white shadow">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--foreground)] capitalize">
                {displayName}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                {roleLabel}
              </p>
            </div>
          </div>
          <button
            id="admin-logout-btn"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile menu overlay ──────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-white p-6 transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight text-[var(--accent)]">NEXAREPORT</span>
          <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--background)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-bold transition-all duration-200 ${
                isActive(item)
                  ? "bg-[var(--accent)] text-white shadow-lg"
                  : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--border)] bg-white px-8">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)] md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div>
              <h2 className="text-sm font-bold text-[var(--muted)]">
                Welcome back, <span className="capitalize">{displayName}</span>
              </h2>
              <p className="text-2xl font-black text-[var(--foreground)]">Overview</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Suspense fallback={null}>
              <AdminHeaderSearch />
            </Suspense>
            <NotificationBell />
            <Link href="/admin/profile">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[var(--foreground)] leading-none capitalize">
                    {displayName}
                  </p>
                  <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mt-1">
                    {roleLabel}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] border-2 border-white shadow-md text-xs font-black text-white">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
    </NotificationProvider>
  );
}
