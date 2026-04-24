"use client";

import { FormEvent, useEffect, useState } from "react";

export default function AdminProfilePage() {
  const [fullName, setFullName] = useState("System Admin");
  const [email, setEmail] = useState("admin@nexareport.rw");
  const [role, setRole] = useState("Project Manager");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Initial data is now hardcoded for this backend-less demo
  }, []);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!fullName.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (newPassword || confirmNewPassword) {
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }
    }

    // saveAdminAccount logic removed
    setNewPassword("");
    setConfirmNewPassword("");
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl animate-fade-in">
      {/* 1. General Information Card */}
      <section className="rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100">
          <div className="h-20 w-20 rounded-2xl bg-[var(--accent)] border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black">
            SA
          </div>
          <div>
            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Identity</h2>
            <p className="text-[15px] font-bold text-[var(--muted)]">Your administrative credentials and role.</p>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSave}>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">Role</label>
            <input
              value={role}
              readOnly
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-bold text-[var(--accent)] outline-none"
            />
          </div>
          {/* <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="rounded-xl bg-[var(--accent)] px-8 py-3 font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Update Identity
            </button>
          </div> */}
        </form>
      </section>

      {/* 2. Security Card */}
      <section className="rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm transition-all hover:shadow-md">
        <div className="mb-10 flex items-center gap-4">
           <div className="h-12 w-12 rounded-xl bg-[#21130D] text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
           </div>
           <div>
              <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Security</h3>
              <p className="text-sm font-bold text-[var(--muted)]">Update your account password.</p>
           </div>
        </div>

        <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSave}>
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>

          {error && <p className="md:col-span-2 text-sm font-bold text-red-600">{error}</p>}
          {message && (
            <p className="md:col-span-2 text-sm font-bold text-emerald-700">{message}</p>
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="rounded-xl border-2 border-[#21130D] bg-[#21130D] px-8 py-3 font-black text-white shadow-sm transition-all hover:translate-y-[-2px] hover:text-white active:scale-95"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
