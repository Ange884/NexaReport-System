import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-6">
      <section className="card w-full max-w-2xl p-10 text-center">
        <p className="text-sm font-semibold tracking-wider text-[var(--muted)]">
          NEXAREPORT
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-[var(--accent)]">
          Admin Control Center
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Securely manage reports, assign actions, track status, and keep issue
          resolution transparent.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Login as Admin
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
          >
            Create Admin Account
          </Link>
        </div>
      </section>
    </main>
  );
}
