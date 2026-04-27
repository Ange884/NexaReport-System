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
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">
      <style>{`
        .nexa-outer-path,.nexa-wavy-path{stroke-dasharray:300;stroke-dashoffset:300;animation:nexa-draw 2s ease forwards}
        .nexa-wavy-path{stroke-dasharray:200;stroke-dashoffset:200;animation-delay:.6s}
        @keyframes nexa-draw{to{stroke-dashoffset:0}}
        .nexa-pulse{animation:nexa-pulse 2s ease-in-out infinite}
        @keyframes nexa-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
      `}</style>

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur-sm md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Toggle Menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(33,19,13,0.06)] text-[#21130D] transition-all duration-200 hover:bg-[rgba(33,19,13,0.12)]"
        >
          <Menu size={20} />
        </button>
        <span className="text-[1.1rem] font-black tracking-[0.06em] text-[#21130D]">NEXA</span>
        <div className="w-9" />
      </header>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#e2e8f0] bg-white px-4 py-6 shadow-[4px_0_24px_rgba(33,19,13,0.05)] transition-transform duration-300 md:static md:translate-x-0 md:flex-shrink-0 md:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-[#21130D] shadow-[0_4px_16px_rgba(33,19,13,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 100 100" fill="none">
              <polygon points="50,26 78,75 22,75" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinejoin="round" />
              <circle cx="26" cy="57" r="8" fill="rgba(255,255,255,0.15)" />
              <circle cx="67" cy="45" r="8" fill="rgba(255,255,255,0.15)" />
              <polygon className="nexa-outer-path" points="50,15 90,85 10,85" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
              <path className="nexa-wavy-path" d="M 26 57 C 38 75, 55 30, 67 45" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <circle cx="26" cy="57" r="4.5" fill="#FFFFFF" />
              <circle cx="67" cy="45" r="4.5" fill="#FFFFFF" />
              <circle cx="50" cy="71" r="3" fill="#FFFFFF" className="nexa-pulse" />
            </svg>
          </div>
          <span className="text-[1.4rem] font-black tracking-[-0.04em] text-[#21130D]">Nexa</span>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-[#718096] transition hover:bg-[rgba(33,19,13,0.06)] hover:text-[#21130D] md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Section label */}
        <p className="mb-2 px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[#718096] opacity-60">
          Navigation
        </p>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-[0.9rem] font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#21130D] text-white shadow-[0_6px_20px_rgba(33,19,13,0.2)]"
                    : "text-[#718096] hover:bg-[rgba(33,19,13,0.04)] hover:text-[#21130D] hover:translate-x-1"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-[22%] h-[56%] w-[3px] rounded-r-full bg-white opacity-60" />
                )}
                <Icon size={19} className="flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-black ${isActive ? "bg-white text-[#21130D]" : "bg-[#21130D] text-white"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Promo block */}
        <div className="mx-1 my-4 overflow-hidden rounded-2xl bg-[rgba(33,19,13,0.04)] p-4 text-[#21130D]">
          <Sparkles size={18} className="mb-2 opacity-70" />
          <p className="text-[0.85rem] font-black">Nexa Pro</p>
          <p className="mt-1 text-[0.7rem] leading-relaxed opacity-55">
            Unlock advanced analytics and priority support.
          </p>
          <button className="mt-3 w-full rounded-xl bg-[#21130D] py-2 text-[0.75rem] font-black text-white shadow-[0_4px_12px_rgba(33,19,13,0.2)] transition-all duration-200 hover:opacity-90 hover:-translate-y-px">
            Upgrade Now
          </button>
        </div>

        {/* Logout */}
        <div className="border-t border-[#e2e8f0] pt-3">
          <Link
            href="/login"
            className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-[0.9rem] font-bold text-red-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={19} strokeWidth={2} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Navbar */}
        <nav className="flex h-16 shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-6 backdrop-blur-sm">
          {/* Search */}
          <div className="relative hidden max-w-sm flex-1 md:flex">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096] opacity-70" />
            <input
              type="text"
              placeholder="Search for issues..."
              className="w-full rounded-xl border border-[#e2e8f0] bg-[#f0f4f8] py-2.5 pl-9 pr-12 text-[0.875rem] font-medium text-[#1a202c] outline-none transition-all duration-300 placeholder:text-[#a0aec0] focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.06)]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 text-[0.6rem] font-bold text-[#718096] shadow-sm">
              ⌘K
            </kbd>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2.5">
            <button
              aria-label="Quick Add"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#718096] transition-all duration-200 hover:border-[rgba(33,19,13,0.2)] hover:bg-[rgba(33,19,13,0.03)] hover:text-[#21130D]"
            >
              <Plus size={18} />
            </button>
            <button
              aria-label="Notifications"
              onClick={() => router.push("/student/dashboard/notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#718096] transition-all duration-200 hover:border-[rgba(33,19,13,0.2)] hover:bg-[rgba(33,19,13,0.03)] hover:text-[#21130D]"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-[#e2e8f0]" />

            {/* User info */}
            <div className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 transition-all duration-200 hover:bg-[rgba(33,19,13,0.03)]">
              <div className="hidden text-right md:block">
                <p className="text-[0.875rem] font-bold leading-none text-[#1a202c]">
                  {greeting}, Alex
                </p>
                <p className="mt-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]">
                  Student Portal
                </p>
              </div>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#21130D] text-[0.7rem] font-black text-white ring-2 ring-[rgba(33,19,13,0.1)] ring-offset-1">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  "AJ"
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-8 md:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
