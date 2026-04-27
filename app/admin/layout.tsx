"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const navItems = [
  {
    href: "/admin", label: "Dashboard", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    )
  },
  {
    href: "/admin/manage-issues", label: "Issues", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
    )
  },
  {
    href: "/admin/send-invite", label: "Send Invitation", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
    )
  },
  {
    href: "/admin/notifications", label: "Alerts", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
    )
  },
  {
    href: "/admin/archive", label: "History", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
    )
  },
  {
    href: "/admin/profile", label: "Profile", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )
  },
];

// Extracted so useSearchParams is inside a Suspense boundary
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
          if (e.key === 'Enter') {
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

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    router.push("/student/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="animate-sidebar sticky top-0 hidden h-full w-64 border-r border-[var(--border)] bg-white p-6 md:block overflow-y-auto">
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

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[16px] font-bold transition-all duration-200 ${pathname === item.href
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[#21130D]/40"
                : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 mb-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--border)] bg-white px-8">
          <div>
            <h2 className="text-sm font-bold text-[var(--muted)]">Welcome back, Administrator</h2>
            <p className="text-2xl font-black text-[var(--foreground)]">Overview</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <input
                  type="text"
                  defaultValue={searchParams.get("q") || ""}
                  placeholder="Search issues, reporters..."
                  className="w-64 rounded-full bg-[var(--background)] border border-transparent px-10 py-2.5 text-sm font-medium outline-none transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[#21130D]/20 group-hover:bg-white group-hover:border-[var(--border)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      router.push(`/admin/manage-issues?q=${encodeURIComponent(val)}`);
                    }
                  }}
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>
              <Link href={"/admin/notifications"}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--muted)] transition hover:text-[var(--accent)] hover:bg-white hover:border border-[var(--border)] cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
              </Link>
              <Link href={"/admin/profile"}>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--foreground)] leading-none">System Admin</p>
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Superuser</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[var(--accent)] border-2 border-white shadow-md"></div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
