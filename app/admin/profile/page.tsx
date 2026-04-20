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
    <section className="card p-5">
      <h2 className="text-2xl font-bold text-[var(--accent)]">Profile Settings</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Update administrator information and password.
      </p>

      <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSave}>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Role</label>
          <input
            value={role}
            readOnly
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2 text-[var(--muted)] outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
          />
        </div>
        {error && <p className="md:col-span-2 text-sm font-medium text-red-600">{error}</p>}
        {message && (
          <p className="md:col-span-2 text-sm font-medium text-emerald-700">{message}</p>
        )}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent)] px-5 py-2 font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
