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
    setMessage("Profile updated successfully (frontend only).");
  }

  return (
    <section className="card p-8 rounded-3xl border border-[var(--border)] shadow-sm max-w-4xl">
      <h2 className="text-2xl font-black text-[var(--foreground)]">Profile Settings</h2>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">
        Update administrator information and security credentials.
      </p>

      <form className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSave}>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)]"
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
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none focus:border-[var(--accent)]"
          />
        </div>
        {error && <p className="md:col-span-2 text-sm font-bold text-red-600">{error}</p>}
        {message && (
          <p className="md:col-span-2 text-sm font-bold text-emerald-700">{message}</p>
        )}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent)] px-8 py-3 font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
