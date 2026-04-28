"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, Camera, Trash2, Settings as SettingsIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/lib/hooks";
import { updatePassword } from "@/app/lib/api";

const inputClass = "w-full rounded-xl border border-[var(--border)] px-4 py-3 text-[15px] font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10 placeholder:text-gray-400";
const disabledInputClass = "w-full rounded-xl border border-[var(--border)] bg-gray-50 px-4 py-3 text-[15px] font-medium text-[var(--muted)] outline-none cursor-not-allowed opacity-80";
const labelClass = "text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading,       setPwLoading]       = useState(false);
  const [pwError,         setPwError]         = useState<string | null>(null);
  const [pwSuccess,       setPwSuccess]       = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nexa_profile_photo");
    if (saved) setProfilePhoto(saved);
  }, []);

  const updateProfilePhoto = (photo: string | null) => {
    setProfilePhoto(photo);
    if (photo) localStorage.setItem("nexa_profile_photo", photo);
    else localStorage.removeItem("nexa_profile_photo");
    window.dispatchEvent(new Event("profilePhotoUpdated"));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(false);
    try {
      await updatePassword({ currentPassword, newPassword, confirmPassword });
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

  const displayName = user?.email.split("@")[0] ?? "";
  const roleLabel   = user?.role.replace(/_/g, " ") ?? "";

  return (
    <section className="card rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">Profile Settings</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Manage your account information and security.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
          <SettingsIcon size={20} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {([
            { key: "profile",  label: "Profile Information", icon: User },
            { key: "security", label: "Change Password",     icon: Lock },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === key
                  ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === "profile" ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 sm:flex-row sm:items-center">
                <div className="relative flex-shrink-0">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[var(--accent)] text-2xl font-black text-white shadow-md">
                    {profilePhoto
                      ? <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                      : displayName.slice(0, 2).toUpperCase()
                    }
                  </div>
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow ring-2 ring-white transition hover:brightness-110">
                    <Camera size={14} strokeWidth={2.5} />
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateProfilePhoto(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-[var(--foreground)]">Profile Photo</p>
                  <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">PNG or JPG, max 5MB.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label htmlFor="photo-upload" className="cursor-pointer rounded-lg border border-[var(--accent)] px-4 py-1.5 text-xs font-black text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white">
                      Change Photo
                    </label>
                    <button type="button" onClick={() => updateProfilePhoto(null)} className="flex items-center gap-1.5 rounded-lg border border-transparent px-4 py-1.5 text-xs font-black text-red-500 transition hover:bg-red-50">
                      <Trash2 size={13} strokeWidth={2.5} /> Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={user?.email ?? ""} readOnly disabled className={disabledInputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Role</label>
                  <input type="text" value={roleLabel} readOnly disabled className={disabledInputClass} />
                  <span className="text-[11px] font-bold text-gray-400">Contact an administrator to change</span>
                </div>
                {user?.className && (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Class</label>
                    <input type="text" value={user.className} readOnly disabled className={disabledInputClass} />
                  </div>
                )}
                {user?.committeePosition && (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Committee Position</label>
                    <input type="text" value={user.committeePosition} readOnly disabled className={disabledInputClass} />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Account Status</label>
                  <input type="text" value={user?.status ?? ""} readOnly disabled className={disabledInputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Member Since</label>
                  <input
                    type="text"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
                    readOnly disabled className={disabledInputClass}
                  />
                </div>
              </div>

              <p className="text-xs font-bold text-[var(--muted)]">
                Profile information is managed by your administrator. Contact them to update your details.
              </p>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="mx-auto max-w-lg space-y-5">
              {pwError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}
              {pwSuccess && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span>Password updated successfully.</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={pwLoading}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={pwLoading}
                  className={inputClass}
                />
                <span className="text-[11px] font-bold text-gray-400">Must be at least 8 characters long</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  disabled={pwLoading}
                  className={inputClass}
                />
              </div>

              <div className="h-px w-full bg-[var(--border)]" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-black text-white shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
                >
                  {pwLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
