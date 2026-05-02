"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Send, FileSignature, ChevronDown, CheckCircle2,
  AlertCircle, Loader2,
} from "lucide-react";
import { createIssue, fetchUsersByRole } from "@/app/lib/api";
import type { IssuePriority, IssueTargetType, UserRole, UserResponse } from "@/app/lib/types";

const CATEGORIES = ["Academic", "Infrastructure", "Administrative", "Technical", "ICT", "Health", "Other"];
const PRIORITIES: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const TARGET_ROLES: { value: UserRole; label: string }[] = [
  { value: "ADMIN",                label: "Admin"                },
  { value: "TEACHER",              label: "Teacher"              },
  { value: "NURSE",                label: "Nurse"                },
  { value: "ADMINISTRATIVE_STAFF", label: "Administrative Staff" },
];

const sel = "w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-3 pr-10 text-[15px] font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10 disabled:opacity-50";
const lbl = "text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]";

export default function SubmitIssue() {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [category,    setCategory]    = useState("");
  const [priority,    setPriority]    = useState<IssuePriority | "">("");

  // Targeting
  const [targetType,    setTargetType]    = useState<IssueTargetType>("ROLE");
  const [targetRole,    setTargetRole]    = useState<UserRole | "">("");
  // For USER mode: role used to fetch the list
  const [userPickRole,  setUserPickRole]  = useState<UserRole | "">("");
  const [selectedUser,  setSelectedUser]  = useState<UserResponse | null>(null);

  // Users list state
  const [users,        setUsers]        = useState<UserResponse[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError,   setUsersError]   = useState<string | null>(null);

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  // When in USER mode and a role is chosen, fetch users for that role
  useEffect(() => {
    if (targetType !== "USER" || !userPickRole) {
      setUsers([]);
      setSelectedUser(null);
      return;
    }
    setUsersLoading(true);
    setUsersError(null);
    setSelectedUser(null);
    fetchUsersByRole(userPickRole)
      .then(setUsers)
      .catch((e: unknown) => setUsersError(e instanceof Error ? e.message : "Failed to load users."))
      .finally(() => setUsersLoading(false));
  }, [targetType, userPickRole]);

  const handleTargetTypeChange = (val: IssueTargetType) => {
    setTargetType(val);
    setTargetRole("");
    setUserPickRole("");
    setSelectedUser(null);
    setUsers([]);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priority || !category) return;
    if (targetType === "ROLE" && !targetRole) return;
    if (targetType === "USER" && !selectedUser) return;

    setIsLoading(true);
    setError(null);
    try {
      await createIssue({
        title,
        description,
        category,
        priority: priority as IssuePriority,
        targetType,
        // Only include targeting fields relevant to the chosen type
        ...(targetType === "ROLE" && targetRole
          ? { targetRole: targetRole as UserRole }
          : {}),
        ...(targetType === "USER" && selectedUser
          ? { targetUserId: selectedUser.id }
          : {}),
        // targetType === "ALL" → no extra fields
      });
      setSuccess(true);
      setTimeout(() => { window.location.href = "/student/dashboard/issues"; }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [title, description, category, priority, targetType, targetRole, selectedUser]);

  if (success) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={36} />
        </div>
        <p className="text-xl font-black text-[var(--foreground)]">Issue Submitted!</p>
        <p className="text-sm font-bold text-[var(--muted)]">Redirecting to your issues…</p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">Submit New Issue</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">Report an issue and we&apos;ll track it for you.</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
          <FileSignature size={20} />
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className={lbl}>Issue Title <span className="text-red-500">*</span></label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title describing the issue" required disabled={isLoading}
              className="rounded-xl border border-[var(--border)] px-4 py-3 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className={lbl}>Description <span className="text-red-500">*</span></label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the issue..." required rows={5} disabled={isLoading}
              className="resize-y rounded-xl border border-[var(--border)] px-4 py-3 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10 disabled:opacity-50"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className={lbl}>Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select required value={category} onChange={(e) => setCategory(e.target.value)} disabled={isLoading} className={sel}>
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={lbl}>Priority <span className="text-red-500">*</span></label>
              <div className="relative">
                <select required value={priority} onChange={(e) => setPriority(e.target.value as IssuePriority)} disabled={isLoading} className={sel}>
                  <option value="" disabled>Select priority</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* ── Targeting section ── */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 space-y-5">
            <p className={lbl}>Send To <span className="text-red-500">*</span></p>

            {/* Target type cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {([
                { value: "ROLE",      label: "A Role",        desc: "All users with a specific role" },
                { value: "USER",      label: "Specific User", desc: "Pick one person by name"        },
                { value: "ALL",       label: "Everyone",      desc: "Public broadcast to all"        },
              ] as { value: IssueTargetType; label: string; desc: string }[]).map((opt) => (
                <button
                  key={opt.value} type="button"
                  onClick={() => handleTargetTypeChange(opt.value)}
                  disabled={isLoading}
                  className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    targetType === opt.value
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-[var(--border)] bg-white hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="text-sm font-black text-[var(--foreground)]">{opt.label}</span>
                  <span className="mt-0.5 text-[11px] font-medium text-[var(--muted)]">{opt.desc}</span>
                </button>
              ))}
            </div>

            {/* ROLE mode: pick a role */}
            {targetType === "ROLE" && (
              <div className="flex flex-col gap-2">
                <label className={lbl}>Target Role <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select required value={targetRole} onChange={(e) => setTargetRole(e.target.value as UserRole)} disabled={isLoading} className={sel}>
                    <option value="" disabled>Select role</option>
                    {TARGET_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            )}

            {/* USER mode: step 1 — pick role, step 2 — pick user from list */}
            {targetType === "USER" && (
              <div className="space-y-4">
                {/* Step 1: role */}
                <div className="flex flex-col gap-2">
                  <label className={lbl}>Step 1 — Select Role <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={userPickRole}
                      onChange={(e) => setUserPickRole(e.target.value as UserRole)}
                      disabled={isLoading}
                      className={sel}
                    >
                      <option value="" disabled>Choose a role to browse users</option>
                      {TARGET_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>

                {/* Step 2: user list */}
                {userPickRole && (
                  <div className="flex flex-col gap-2">
                    <label className={lbl}>Step 2 — Select User <span className="text-red-500">*</span></label>

                    {usersLoading && (
                      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-bold text-[var(--muted)]">
                        <Loader2 size={14} className="animate-spin" /> Loading users…
                      </div>
                    )}

                    {usersError && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                        <AlertCircle size={14} /> {usersError}
                      </div>
                    )}

                    {!usersLoading && !usersError && users.length === 0 && (
                      <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-bold text-[var(--muted)]">
                        No users found for this role.
                      </div>
                    )}

                    {!usersLoading && users.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {users.map((u) => {
                          const name = u.email.split("@")[0];
                          const isSelected = selectedUser?.id === u.id;
                          return (
                            <button
                              key={u.id} type="button"
                              onClick={() => setSelectedUser(isSelected ? null : u)}
                              disabled={isLoading}
                              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                                isSelected
                                  ? "border-[var(--accent)] bg-[var(--accent)]/5"
                                  : "border-[var(--border)] bg-white hover:border-[var(--accent)]/40"
                              }`}
                            >
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                isSelected ? "bg-[var(--accent)] text-white" : "bg-[var(--background)] text-[var(--muted)]"
                              }`}>
                                {name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black text-[var(--foreground)] capitalize">{name}</p>
                                <p className="truncate text-[10px] font-bold text-[var(--muted)]">{u.email}</p>
                              </div>
                              {isSelected && <CheckCircle2 size={16} className="shrink-0 text-[var(--accent)]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Selected user confirmation */}
                    {selectedUser && (
                      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Sending to: <span className="capitalize">{selectedUser.email.split("@")[0]}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-px w-full bg-[var(--border)]" />

          <div className="flex justify-end">
            <button
              type="submit" disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-black text-white shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={2.5} />}
              {isLoading ? "Submitting…" : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
