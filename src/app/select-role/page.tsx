"use client";

import Link from "next/link";

export default function SelectRolePage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1
        className="mb-6 text-2xl font-bold"
        style={{ fontFamily: "var(--font-head)" }}
      >
        Select your role
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/signin/champion"
          className="rounded-2xl border border-[#eee6e0] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="mb-2 text-3xl">🛡️</div>
          <div
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Champion
          </div>
          <div className="mt-2 text-sm text-[var(--ash)]">
            Continue as Champion
          </div>
        </Link>

        <Link
          href="/signin/officer"
          className="rounded-2xl border border-[#eee6e0] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="mb-2 text-3xl">🏢</div>
          <div
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Hub Officer
          </div>
          <div className="mt-2 text-sm text-[var(--ash)]">
            Continue as Hub Officer
          </div>
        </Link>

        <Link
          href="/signin/admin"
          className="rounded-2xl border border-[#eee6e0] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="mb-2 text-3xl">⚙️</div>
          <div
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Admin
          </div>
          <div className="mt-2 text-sm text-[var(--ash)]">
            Continue as Admin
          </div>
        </Link>
      </div>
    </main>
  );
}
