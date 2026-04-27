"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Simplified login logic (no backend check)
    router.push(searchParams.get("next") || "/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f0f0] p-4 font-sans">
      <section className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Left Side: Login Form */}
        <div className="flex w-full flex-col justify-center p-6 md:w-1/2 lg:p-10">
          <div className="mb-4 flex justify-center md:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--accent)]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Please enter your details.</p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@nexareport.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none transition duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-[var(--border)] text-[var(--accent)] accent-[var(--accent)]"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-sm font-bold text-[var(--accent)]"
              >
                Forgot Password
              </Link>
            </div>

            {error && <p className="text-xs font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-2 block w-full rounded-xl bg-[var(--accent)] py-3 text-center font-bold text-white shadow-lg transition duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Submit
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--muted)] md:text-left">
            Don't have account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[var(--accent)] hover:underline"
            >
              Request a free trial
            </Link>
          </p>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 shadow-sm transition hover:shadow-md">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted)]">
                presented by
              </span>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] p-1">
                <svg viewBox="0 0 24 24" fill="white" className="h-2.5 w-2.5 accent-[var(--accent)]">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-[10px] font-black tracking-tighter text-[var(--accent)]">
                NEXACORE
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Features & Gradient */}
        <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-[var(--accent)] p-10 text-white md:flex">
          {/* Decorative Gradient Background */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#21130d] via-[#3a2218] to-[#21130d]" />
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

          <div className="relative z-10 space-y-6">
            <FeatureItem
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              title="Secure Reporting"
              description="End-to-end encrypted issue submission for privacy."
            />
            <FeatureItem
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              }
              title="Centralized Monitoring"
              description="Real-time dashboard for issue management."
            />
            <FeatureItem
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              }
              title="Role-Based Access"
              description="Permissions for Students, Teachers, and Admins."
            />
            <FeatureItem
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                </svg>
              }
              title="Actionable Insights"
              description="Prioritize resolution with detailed reporting."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 transition duration-300 hover:translate-x-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-inner">
        {icon}
      </div>
      <div className="group flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          {description}
        </p>
        <div className="mt-4 h-[1px] w-full bg-white/10" />
      </div>
    </div>
  );
}
