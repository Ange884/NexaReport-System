"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, Camera, Trash2 } from "lucide-react";

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

  const inputClass =
    "w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-4 py-3 text-[0.9375rem] font-medium text-[#1a202c] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]";
  const disabledInputClass =
    "w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#f0f4f8] px-4 py-3 text-[0.9375rem] font-medium text-[#718096] outline-none cursor-not-allowed opacity-70";

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[1.875rem] font-black tracking-tight text-[#1a202c]">
          Profile Settings
        </h1>
        <p className="mt-1 text-[0.9375rem] font-semibold text-[#718096]">
          Manage your account information and security.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-[#e2e8f0]">
          {(
            [
              { key: "profile", label: "Profile Information", icon: User },
              { key: "security", label: "Change Password", icon: Lock },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === key
                  ? "border-b-2 border-[#21130D] text-[#21130D]"
                  : "text-[#718096] hover:text-[#1a202c]"
              }`}
            >
              <Icon size={18} strokeWidth={2.5} />
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
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Avatar preview */}
                  <div className="relative flex-shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#21130D] text-xl font-black text-white shadow-lg">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "AJ"
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#21130D] text-white shadow-md transition hover:opacity-90"
                    >
                      <Camera size={16} />
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
                          reader.onloadend = () =>
                            updateProfilePhoto(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  {/* Controls */}
                  <div>
                    <h3 className="font-extrabold text-[#1a202c]">
                      Profile Photo
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#718096]">
                      PNG or JPG, max 5MB.
                    </p>
                    <div className="mt-3 flex gap-3">
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer rounded-xl border border-[#21130D] px-4 py-2 text-xs font-bold text-[#21130D] transition hover:bg-[rgba(33,19,13,0.06)]"
                      >
                        Change Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => updateProfilePhoto(null)}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-[#e2e8f0]" />

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="landrate2000@gmail.com"
                    className={inputClass}
                  />
                </div>

                {/* Position (read-only) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    Position
                  </label>
                  <input
                    type="text"
                    defaultValue="Class Monitor"
                    readOnly
                    disabled
                    className={disabledInputClass}
                  />
                  <span className="text-xs font-medium text-[#718096]">
                    Contact an administrator to change your position
                  </span>
                </div>

                {/* Role (read-only) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue="Student"
                    readOnly
                    disabled
                    className={disabledInputClass}
                  />
                  <span className="text-xs font-medium text-[#718096]">
                    Your account role
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Current Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    className={inputClass}
                  />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className={inputClass}
                  />
                  <span className="text-xs font-medium text-[#718096]">
                    Must be at least 8 characters long
                  </span>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            {/* Save button */}
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#21130D] px-8 py-3.5 text-sm font-black text-white shadow-[0_4px_14px_rgba(33,19,13,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(33,19,13,0.4)] active:scale-[0.97]"
            >
              <Save size={20} strokeWidth={2.5} />
              {activeTab === "profile" ? "Save Changes" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
