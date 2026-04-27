"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { loginUser } from "@/app/lib/api";
import { setupSession, isAuthenticated } from "@/app/lib/auth";
import { isAdminRole } from "@/app/lib/types";

export default function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });

      // Persist token + user info (also syncs to cookie for middleware)
      setupSession(data.accessToken, data.user);

      const role = data.user.role;

      // Enforce: only admin-tier roles can access the admin portal
      if (!isAdminRole(role)) {
        setError(
          "Access denied. This portal is for administrators only. Please use the student login."
        );
        const { clearSession } = await import("@/app/lib/auth");
        clearSession();
        return;
      }

      // Redirect to the page they originally tried to access, or /admin
      const next = searchParams.get("next") || "/admin";
      router.replace(next.startsWith("/admin") ? next : "/admin");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right,rgba(33,19,13,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(33,19,13,0.04) 1px,transparent 1px)",
        }}
      />
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[600px] w-[600px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[40px]" />
      <div className="pointer-events-none absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[40px]" />

      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between gap-16 px-8 py-10 md:px-12">
        {/* Left showcase */}
        <div className="hidden flex-1 flex-col justify-center md:flex">
          <h1
            className="mb-6 text-[5rem] leading-[1.1] tracking-wide text-[#21130D]"
            style={{ fontFamily: "'Creepster', cursive", textShadow: "2px 2px 4px rgba(33,19,13,0.1)" }}
          >
            Speak Up!
          </h1>
          <p className="max-w-[80%] text-xl font-medium leading-relaxed text-[#21130D] opacity-80">
            A fast, secure, and hassle-free platform for students to report
            issues easily to the staff. Your voice matters here.
          </p>
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[rgba(33,19,13,0.12)] bg-[rgba(33,19,13,0.03)] px-5 py-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#21130D]" />
            <p className="text-sm font-medium text-[#21130D] opacity-70">
              This portal is restricted to administrators, teachers, nurses, and
              administrative staff only.
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="relative w-full max-w-[480px] overflow-hidden rounded-lg border border-[rgba(33,19,13,0.08)] bg-white/95 px-14 py-14 shadow-[0_24px_60px_rgba(33,19,13,0.12)] backdrop-blur-xl">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-[#21130D]" />

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D] text-white shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[1.4rem] font-black tracking-[0.08em] text-[#21130D]">NEXA</span>
          </div>

          <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#21130D]">
            Admin Sign In
          </h2>
          <p className="mt-1 text-center text-sm text-[#718096]">
            Access your admin portal.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#21130D]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-4 text-[#718096]" size={18} />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#1a202c] outline-none transition focus:border-[#21130D] focus:ring-4 focus:ring-[rgba(33,19,13,0.08)] disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#21130D]">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-4 text-[#718096]" size={18} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-12 text-sm font-medium text-[#1a202c] outline-none transition focus:border-[#21130D] focus:ring-4 focus:ring-[rgba(33,19,13,0.08)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center rounded-lg p-1 text-[#718096] transition hover:bg-[rgba(33,19,13,0.05)] hover:text-[#21130D]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#21130D] py-3 text-center font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#718096]">
            Not an admin?{" "}
            <Link href="/student/login" className="font-bold text-[#21130D] hover:underline">
              Student login
            </Link>
          </p>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');`}</style>
    </main>
  );
}
