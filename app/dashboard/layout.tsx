"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, List, Shield, Bell, Settings, LogOut, LayoutDashboard } from 'lucide-react';

const DashboardLayout = ({children}) => {
  const pathname = usePathname();
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <div className="logo-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 100 100" fill="none">
                <defs>
                  {/* Premium Platinum Gradient for the line */}
                  <linearGradient id="platinumGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#e0e0e0" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>

                  {/* Elegant Drop Shadow Filter for 3D depth */}
                  <filter id="premiumShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.4"/>
                  </filter>
                </defs>

                <g filter="url(#premiumShadow)">
                  {/* Inner Translucent White Triangle */}
                  <polygon points="50,26 78,75 22,75" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinejoin="round" />
                  
                  {/* Faint Circles behind the dots */}
                  <circle cx="26" cy="57" r="8" fill="rgba(255,255,255,0.15)" />
                  <circle cx="67" cy="45" r="8" fill="rgba(255,255,255,0.15)" />

                  {/* Outer White Triangle (Animated) */}
                  <polygon className="logo-outer-path" points="50,15 90,85 10,85" fill="none" stroke="url(#platinumGlow)" strokeWidth="6" strokeLinejoin="round" />

                  {/* Wavy Intersecting Line (Animated) */}
                  <path className="logo-wavy-path" d="M 26 57 C 38 75, 55 30, 67 45" fill="none" stroke="url(#platinumGlow)" strokeWidth="5" strokeLinecap="round" />

                  {/* Solid End Dots */}
                  <circle cx="26" cy="57" r="4.5" fill="#FFFFFF" />
                  <circle cx="67" cy="45" r="4.5" fill="#FFFFFF" />

                  {/* Small Center Pulsing Dot */}
                  <circle cx="50" cy="71" r="3" fill="#FFFFFF" className="logo-pulse-dot" />
                </g>
              </svg>
            </div>
            <div className="sidebar-brand">Nexa</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className={pathname === "/dashboard" ? "nav-item active" : "nav-item"}>
            <LayoutDashboard className="icon" size={20} />
            Dashboard
          </Link>

          <Link href="/dashboard/submit" className={pathname === "/dashboard/submit" ? "nav-item active" : "nav-item"}>
            <FileText className="icon" size={20} />
            Submit Issue
          </Link>
          
          <Link href="/dashboard/issues" className={pathname === "/dashboard/issues" ? "nav-item active" : "nav-item"}>
            <List className="icon" size={20} />
            My Issues
          </Link>

          <Link href="/dashboard/public" className={pathname === "/dashboard/public" ? "nav-item active" : "nav-item"}>
            <Shield className="icon" size={20} />
            Public Feed
          </Link>

          <Link href="/dashboard/notifications" className={pathname === "/dashboard/notifications" ? "nav-item active" : "nav-item"}>
            <Bell className="icon" size={20} />
            Notifications
            <span className="nav-badge">2</span>
          </Link>

          <Link href="/dashboard/settings" className={pathname === "/dashboard/settings" ? "nav-item active" : "nav-item"}>
            <Settings className="icon" size={20} />
            Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link href="/login" className="nav-item">
            <LogOut className="icon" size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main animate-slide-up">
        <div className="dashboard-content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
