"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, Camera, Trash2, Settings as SettingsIcon } from "lucide-react";

const inputClass = "w-full rounded-xl border border-[var(--border)] px-4 py-3 text-[15px] font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10 placeholder:text-gray-400";
const disabledInputClass = "w-full rounded-xl border border-[var(--border)] bg-gray-50 px-4 py-3 text-[15px] font-medium text-[var(--muted)] outline-none cursor-not-allowed opacity-80";
const labelClass = "text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

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

      {/* Card */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white shadow-sm">

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {([
            { key: "profile", label: "Profile Information", icon: User },
            { key: "security", label: "Change Password", icon: Lock },
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

        {/* Content */}
        <div className="p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {activeTab === "profile" ? (
              <>
                {/* Profile Photo */}
                <div className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 sm:flex-row sm:items-center">
                  <div className="relative flex-shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[var(--accent)] text-2xl font-black text-white shadow-md">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                      ) : "AJ"}
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
                    <label className={labelClass}>Full Name</label>
                    <input type="text" defaultValue="John Doe" className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Email Address</label>
                    <input type="email" defaultValue="landrate2000@gmail.com" className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Position</label>
                    <input type="text" defaultValue="Class Monitor" readOnly disabled className={disabledInputClass} />
                    <span className="text-[11px] font-bold text-gray-400">Contact an administrator to change</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Role</label>
                    <input type="text" defaultValue="Student" readOnly disabled className={disabledInputClass} />
                    <span className="text-[11px] font-bold text-gray-400">Your account role</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-lg space-y-5">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Current Password</label>
                  <input type="password" placeholder="Enter your current password" className={inputClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>New Password</label>
                  <input type="password" placeholder="Enter new password" className={inputClass} />
                  <span className="text-[11px] font-bold text-gray-400">Must be at least 8 characters long</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Confirm New Password</label>
                  <input type="password" placeholder="Re-enter new password" className={inputClass} />
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px w-full bg-[var(--border)]" />

            {/* Save */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-black text-white shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <Save size={16} strokeWidth={2.5} />
                {activeTab === "profile" ? "Save Changes" : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
