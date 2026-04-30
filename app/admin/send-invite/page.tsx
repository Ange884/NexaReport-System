"use client";

import React, { FormEvent, useState, useRef, useEffect } from "react";
import {
  Mail, User, ShieldCheck, Send, Info,
  CheckCircle2, AlertCircle, Loader2, ChevronDown,
} from "lucide-react";
import { inviteUser } from "@/app/lib/api";
import type { UserRole } from "@/app/lib/types";

// ─── Role options matching backend UserRole enum ──────────────────────────────

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: "ADMIN",              label: "Administrator",      description: "Full system control and user management." },
  { value: "TEACHER",           label: "Teacher",            description: "Academic oversight and issue review." },
  { value: "NURSE",             label: "Nurse",              description: "Health & welfare issue handler." },
  { value: "ADMINISTRATIVE_STAFF", label: "Administrative Staff", description: "Internal operations and task execution." },
  { value: "COMMITTEE_MEMBER",  label: "Committee Member",   description: "Committee-level issue submission." },
  { value: "CLASS_MONITOR",     label: "Class Monitor",      description: "Class-level issue reporting." },
  { value: "STUDENT",           label: "Student",            description: "General student issue submission only." },
];

export default function SendInvitePage() {
  const [fullNames, setFullNames] = useState("");
  const [email,     setEmail]     = useState("");
  const [role,      setRole]      = useState<UserRole>("TEACHER");
  const [className, setClassName] = useState("");
  const [position,  setPosition]  = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success,      setSuccess]      = useState<{ email: string; tempPassword: string } | null>(null);
  const [error,        setError]        = useState<string | null>(null);
  const [isRoleOpen,   setIsRoleOpen]   = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const needsClass    = role === "CLASS_MONITOR" || role === "STUDENT";
  const needsPosition = role === "COMMITTEE_MEMBER";
  const selectedRoleInfo = ROLE_OPTIONS.find((r) => r.value === role);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullNames.trim() || !email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    if (needsClass && !className.trim()) {
      setError("Class name is required for this role.");
      return;
    }
    if (needsPosition && !position.trim()) {
      setError("Committee position is required for this role.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await inviteUser({
        email,
        fullNames,
        role,
        ...(needsClass    ? { className }           : {}),
        ...(needsPosition ? { committeePosition: position } : {}),
      });
      setSuccess({ email: result.email, tempPassword: result.temporaryPassword });
      setFullNames(""); setEmail(""); setClassName(""); setPosition("");
      setRole("TEACHER");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send invitation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[var(--accent)]">Send Invitation</h1>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] opacity-70">
          Admin Member Management
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* ── Main Form ── */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex-1 rounded-2xl border border-[var(--border)] bg-white p-8 shadow-xl shadow-[var(--accent)]/5">

            {/* Success banner */}
            {success && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <p className="text-sm font-black text-emerald-700">Invitation sent to {success.email}</p>
                </div>
                <p className="text-xs font-bold text-emerald-600">
                  Temporary password:{" "}
                  <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono font-black tracking-wider">
                    {success.tempPassword}
                  </code>
                  {" "}— share this securely with the new member.
                </p>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle size={15} className="shrink-0 text-red-500" />
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="ml-1 block text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="group relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition group-focus-within:text-[var(--accent)]" size={16} />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    required
                    value={fullNames}
                    onChange={(e) => setFullNames(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm font-bold outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 placeholder:text-[var(--muted)]/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="ml-1 block text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition group-focus-within:text-[var(--accent)]" size={16} />
                  <input
                    type="email"
                    placeholder="name@school.ac"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm font-bold outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 placeholder:text-[var(--muted)]/40"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="ml-1 block text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                  Assigned Role <span className="text-red-500">*</span>
                </label>
                <div className="group relative" ref={dropdownRef}>
                  <ShieldCheck className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 transition ${isRoleOpen ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} size={16} />
                  
                  <button
                    type="button"
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className={`flex w-full items-center justify-between rounded-xl border bg-[var(--background)] py-3 pl-10 pr-4 text-sm font-bold outline-none transition-all ${
                      isRoleOpen 
                        ? "border-[var(--accent)] bg-white ring-4 ring-[var(--accent)]/5" 
                        : "border-[var(--border)] hover:border-[var(--accent)]/40"
                    }`}
                  >
                    <span className={role ? "text-[var(--foreground)]" : "text-[var(--muted)]/40"}>
                      {ROLE_OPTIONS.find(r => r.value === role)?.label || "Select Role"}
                    </span>
                    <ChevronDown className={`text-[var(--muted)] transition-transform duration-200 ${isRoleOpen ? "rotate-180 text-[var(--accent)]" : ""}`} size={14} />
                  </button>

                  {/* Custom Dropdown Menu */}
                  {isRoleOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-1.5 shadow-2xl shadow-[var(--accent)]/10 animate-fade-in">
                      {ROLE_OPTIONS.map((r) => (
                        <div
                          key={r.value}
                          onClick={() => {
                            setRole(r.value);
                            setIsRoleOpen(false);
                          }}
                          className={`group flex cursor-pointer flex-col rounded-lg px-3 py-2.5 transition-all ${
                            role === r.value 
                              ? "bg-[var(--accent)] text-white" 
                              : "text-[var(--foreground)] hover:bg-[var(--accent)]/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold">{r.label}</span>
                            {role === r.value && <CheckCircle2 size={12} className="text-white/80" />}
                          </div>
                          <p className={`mt-0.5 text-[10px] leading-tight ${role === r.value ? "text-white/70" : "text-[var(--muted)]"}`}>
                            {r.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedRoleInfo && (
                  <p className="ml-1 text-[11px] font-bold text-[var(--muted)]">{selectedRoleInfo.description}</p>
                )}
              </div>

              {/* Class Name (conditional) */}
              {needsClass && (
                <div className="space-y-1.5">
                  <label className="ml-1 block text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S6 PCM A"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 placeholder:text-[var(--muted)]/40"
                  />
                </div>
              )}

              {/* Committee Position (conditional) */}
              {needsPosition && (
                <div className="space-y-1.5">
                  <label className="ml-1 block text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                    Committee Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vice President"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 placeholder:text-[var(--muted)]/40"
                  />
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[var(--accent)]/20 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Sending…</>
                  ) : (
                    <><span>Send Official Invite</span><Send size={14} className="transition group-hover:translate-x-1" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Role guide */}
          <div className="flex-1 rounded-2xl bg-[var(--accent)] p-6 text-white shadow-xl shadow-[var(--accent)]/10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Info size={18} />
              </div>
              <h3 className="text-lg font-black tracking-tight">Role Guide</h3>
            </div>
            <div className="space-y-3.5">
              {ROLE_OPTIONS.map((r) => (
                <div
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`cursor-pointer rounded-xl border p-3 transition ${role === r.value ? "border-white/40 bg-white/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}
                >
                  <p className="text-[13px] font-black">{r.label}</p>
                  <p className="mt-0.5 text-[11px] opacity-70">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-black text-[var(--accent)]">Security Protocol</h3>
            <p className="text-[11px] font-bold leading-relaxed text-[var(--muted)]">
              A temporary password is generated for each invite. The new member must
              change it on first login. Share credentials{" "}
              <span className="text-[var(--accent)]">securely and privately</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
