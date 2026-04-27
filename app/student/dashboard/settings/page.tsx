"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, Camera, Trash2, Settings as SettingsIcon } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] px-5 py-4 text-[1rem] font-bold text-[#1a202c] outline-none transition-all duration-300 placeholder:font-medium placeholder:text-[#a0aec0] focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06)]";

const disabledInputClass =
  "w-full rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.025)] px-5 py-4 text-[1rem] font-bold text-[#718096] outline-none cursor-not-allowed opacity-70";

const labelClass =
  "text-[0.8rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nexa_profile_photo");
    if (saved) setProfilePhoto(saved);  
  }, []);

  const updateProfilePhoto = (photo: string | null) => {
    setProfilePhoto(photo);
    if (photo) {
      localStorage.setItem("nexa_profile_photo", photo);
    } else {
      localStorage.removeItem("nexa_profile_photo");
    }
    window.dispatchEvent(new Event("profilePhotoUpdated"));
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-10 flex items-start gap-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#21130D] shadow-[inset_0_2px_8px_rgba(33,19,13,0.08)] ring-1 ring-[rgba(33,19,13,0.06)]">
          <SettingsIcon size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-[#1a202c]">
            Profile Settings
          </h1>
          <p className="mt-1.5 text-[1.05rem] font-medium leading-relaxed text-[#718096]">
            Manage your account information and security preferences.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_8px_40px_rgba(33,19,13,0.06),0_2px_8px_rgba(33,19,13,0.04)]">
        {/* Top accent bar */}
        <div className="absolute left-0 top-0 h-1 w-full bg-[#21130D]" />

        {/* Tabs */}
        <div className="border-b border-[#e2e8f0] bg-[rgba(33,19,13,0.015)] px-6 pt-6 pb-0">
          <div className="flex gap-1">
            {(
              [
                { key: "profile", label: "Profile Information", icon: User },
                { key: "security", label: "Change Password", icon: Lock },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2.5 rounded-t-xl border border-b-0 px-6 py-3.5 text-[0.9rem] font-extrabold transition-all duration-300 ${
                  activeTab === key
                    ? "border-[#e2e8f0] bg-white text-[#21130D] shadow-[0_-4px_12px_rgba(33,19,13,0.05)]"
                    : "border-transparent text-[#718096] hover:text-[#1a202c]"
                }`}
              >
                <Icon size={17} strokeWidth={2.5} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {activeTab === "profile" ? (
              <>
                {/* Profile Photo */}
                <div className="flex flex-col gap-6 rounded-2xl border border-[rgba(33,19,13,0.06)] bg-[rgba(33,19,13,0.015)] p-6 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 rounded-full bg-[rgba(33,19,13,0.04)] blur-sm" />
                    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#21130D] text-3xl font-black text-white shadow-[0_12px_32px_rgba(33,19,13,0.25)]">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        "AJ"
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#21130D] text-white shadow-[0_4px_12px_rgba(33,19,13,0.3)] ring-4 ring-white transition-transform duration-200 hover:scale-110"
                    >
                      <Camera size={16} strokeWidth={2.5} />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
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

                  {/* Controls */}
                  <div>
                    <h3 className="text-[1.1rem] font-black text-[#1a202c]">Profile Photo</h3>
                    <p className="mt-1 text-[0.9rem] font-semibold text-[#718096]">
                      PNG or JPG, max 5MB.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer rounded-xl border-2 border-[#21130D] px-5 py-2 text-[0.8rem] font-black uppercase tracking-wider text-[#21130D] transition-all duration-200 hover:bg-[#21130D] hover:text-white"
                      >
                        Change Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => updateProfilePhoto(null)}
                        className="flex items-center gap-1.5 rounded-xl border-2 border-transparent px-5 py-2 text-[0.8rem] font-black uppercase tracking-wider text-red-500 transition-all duration-200 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 size={15} strokeWidth={2.5} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2.5">
                    <label className={labelClass}>Full Name</label>
                    <input type="text" defaultValue="John Doe" className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className={labelClass}>Email Address</label>
                    <input type="email" defaultValue="landrate2000@gmail.com" className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className={labelClass}>Position</label>
                    <input type="text" defaultValue="Class Monitor" readOnly disabled className={disabledInputClass} />
                    <span className="text-[0.78rem] font-bold text-[#a0aec0]">
                      Contact an administrator to change
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className={labelClass}>Role</label>
                    <input type="text" defaultValue="Student" readOnly disabled className={disabledInputClass} />
                    <span className="text-[0.78rem] font-bold text-[#a0aec0]">Your account role</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-xl space-y-6">
                <div className="flex flex-col gap-2.5">
                  <label className={labelClass}>Current Password</label>
                  <input type="password" placeholder="Enter your current password" className={inputClass} />
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className={labelClass}>New Password</label>
                  <input type="password" placeholder="Enter new password" className={inputClass} />
                  <span className="text-[0.78rem] font-bold text-[#a0aec0]">
                    Must be at least 8 characters long
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className={labelClass}>Confirm New Password</label>
                  <input type="password" placeholder="Re-enter new password" className={inputClass} />
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[rgba(33,19,13,0.06)] pt-2" />

            {/* Save button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#21130D] px-10 py-4 text-[1rem] font-black text-white shadow-[0_8px_24px_rgba(33,19,13,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(33,19,13,0.35)] active:scale-[0.97]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                <Save size={18} strokeWidth={2.5} className="relative" />
                <span className="relative">
                  {activeTab === "profile" ? "Save Profile Changes" : "Update Secure Password"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
