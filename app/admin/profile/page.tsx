"use client";

import { FormEvent, useState } from "react";
import { Loader2, Lock, ShieldCheck, User, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/lib/hooks";
import { updatePassword } from "@/app/lib/api";

export default function AdminProfilePage() {
  const { user, isLoading } = useAuth();

  // Password change state
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwLoading,  setPwLoading]  = useState(false);
  const [pwSuccess,  setPwSuccess]  = useState<string | null>(null);
  const [pwError,    setPwError]    = useState<string | null>(null);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!currentPw.trim()) { setPwError("Current password is required."); return; }
    if (newPw.length < 8)  { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }

    setPwLoading(true);
    try {
      const res = await updatePassword({
        currentPassword: currentPw,
        newPassword:     newPw,
        confirmPassword: confirmPw,
      });
      setPwSuccess(res.message || "Password updated successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  }

  // Skeleton while auth is loading
  if (isLoading) {
    return (
      <div className="flex max-w-4xl animate-fade-in flex-col gap-8">
        <div className="h-52 animate-pulse rounded-3xl bg-[var(--border)]" />
        <div className="h-64 animate-pulse rounded-3xl bg-[var(--border)]" />
      </div>
    );
  }

  if (!user) return null;

  const initials  = user.email.split("@")[0].slice(0, 2).toUpperCase();
  const displayName = user.email.split("@")[0];
  const rolePretty  = user.role.replace(/_/g, " ");

  const infoRows = [
    { label: "Email Address",   value: user.email },
    { label: "Role",            value: rolePretty },
    { label: "Account Status",  value: user.status },
    { label: "Class",           value: user.className ?? "—" },
    { label: "Committee Position", value: user.committeePosition ?? "—" },
    { label: "Member Since",    value: new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
  ];

  return (
    <div className="flex max-w-4xl animate-fade-in flex-col gap-8">

      {/* ── Identity Card ── */}
      <section className="rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm transition hover:shadow-md">
        {/* Avatar + name */}
        <div className="mb-8 flex items-center gap-6 border-b border-[var(--border)] pb-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-3xl font-black text-white shadow-xl">
            {initials}
          </div>
          <div>
            <h2 className="text-3xl font-black capitalize tracking-tight text-[var(--foreground)]">
              {displayName}
            </h2>
            <p className="mt-1 font-bold capitalize text-[var(--muted)]">{rolePretty}</p>
            <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest ${
              user.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-700"
                : user.status === "PENDING"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {user.status}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
            <User size={18} />
          </div>
          <h3 className="text-lg font-black text-[var(--foreground)]">Profile Information</h3>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <dt className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{label}</dt>
              <dd className="mt-1 text-sm font-bold capitalize text-[var(--foreground)]">{value.toLowerCase()}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Security / Password ── */}
      <section className="rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm transition hover:shadow-md">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#21130D] text-white">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-[var(--foreground)]">Security</h3>
            <p className="text-sm font-bold text-[var(--muted)]">Update your account password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Current password — full width */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              Current Password
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              New Password
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
            />
          </div>

          {/* Feedback */}
          {pwError && (
            <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
              <AlertCircle size={14} className="shrink-0" /> {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={14} className="shrink-0" /> {pwSuccess}
            </div>
          )}

          {/* Submit */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center gap-2 rounded-xl bg-[#21130D] px-8 py-3 font-black text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {pwLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Updating…</>
              ) : (
                <><ShieldCheck size={16} /> Update Password</>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
