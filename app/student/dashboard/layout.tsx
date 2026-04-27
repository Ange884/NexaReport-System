"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText, List, Shield, Bell, Settings, LogOut,
  LayoutDashboard, Menu, X, Search, Plus, Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/dashboard/submit", label: "Submit Issue", icon: FileText },
  { href: "/student/dashboard/issues", label: "My Issues", icon: List },
  { href: "/student/dashboard/public", label: "Public Feed", icon: Shield },
  { href: "/student/dashboard/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { href: "/student/dashboard/settings", label: "Settings", icon: Settings },
];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => { setIsSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("nexa_profile_photo");
    if (savedPhoto) setProfilePhoto(savedPhoto);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    const sync = () => setProfilePhoto(localStorage.getItem("nexa_profile_photo"));
    window.addEventListener("storage", sync);
    window.addEventListener("profilePhotoUpdated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("profilePhotoUpdated", sync);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-white px-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Toggle Menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
        >
          <Menu size={20} />
        </button>
        <span className="text-lg font-black tracking-tight text-[var(--accent)]">NEXAREPORT</span>
        <div className="w-9" />
      </header>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col overflow-y-auto border-r border-[var(--border)] bg-white p-6 transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-[var(--accent)]">NEXAREPORT</span>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--accent)] md:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[16px] font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[#21130D]/40"
                    : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                }`}
              >
                <Icon size={20} />
                {item.label}
                {item.badge && (
                  <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-black ${isActive ? "bg-white text-[var(--accent)]" : "bg-[var(--accent)] text-white"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Promo */}
        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-4">
          <Sparkles size={18} className="mb-2 text-[var(--accent)]" />
          <p className="text-sm font-black text-[var(--accent)]">Nexa Pro</p>
          <p className="mt-1 text-[0.7rem] leading-relaxed text-[var(--muted)]">Unlock advanced analytics and priority support.</p>
          <button className="mt-3 w-full rounded-xl bg-[var(--accent)] py-2 text-xs font-black text-white transition hover:brightness-110">
            Upgrade Now
          </button>
        </div>

        {/* Logout */}
        <div className="mt-10 mb-6">
          <button
            onClick={() => router.push("/student/login")}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--border)] bg-white px-8">
          <div>
            <h2 className="text-sm font-bold text-[var(--muted)]">{greeting}, Alex</h2>
            <p className="text-2xl font-black text-[var(--foreground)]">Student Portal</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="Search issues..."
                className="w-64 rounded-full bg-[var(--background)] border border-transparent px-10 py-2.5 text-sm font-medium outline-none transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[#21130D]/20 group-hover:bg-white group-hover:border-[var(--border)]"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                <Search size={16} />
              </div>
            </div>

            {/* Quick add */}
            <button
              aria-label="Quick Add"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--muted)] transition hover:bg-white hover:border hover:border-[var(--border)] hover:text-[var(--accent)]"
            >
              <Plus size={20} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              onClick={() => router.push("/student/dashboard/notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--muted)] transition hover:bg-white hover:border hover:border-[var(--border)] hover:text-[var(--accent)]"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User */}
            <Link href="/student/dashboard/settings">
              <div className="flex items-center gap-3">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-bold text-[var(--foreground)] leading-none">Alex Johnson</p>
                  <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Student</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-xs font-black text-white border-2 border-white shadow-md">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                  ) : "AJ"}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
