"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [stage, setStage] = useState<"working" | "done">("working");
  const params = useSearchParams();
  const router = useRouter();
  const from = params.get("from") || "/";

  useEffect(() => {
    const t1 = setTimeout(() => setStage("done"), 2000); // fake sync
    const t2 = setTimeout(() => router.push(from), 3300); // auto-return
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [router, from]);

  return (
    <main className="flex h-dvh flex-col items-center justify-center bg-[var(--sand)] px-6 text-center">
      <div className="w-full max-w-sm rounded-2xl border border-[#e7dfd9] bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EDE7]">
          {stage === "working" ? (
            <span
              className="block h-8 w-8 animate-spin rounded-full border-4 border-[var(--clay)] border-r-transparent"
              aria-label="Loading"
            />
          ) : (
            <span className="text-3xl" aria-hidden>
              ✅
            </span>
          )}
        </div>

        <h1
          className="text-xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-head)" }}
        >
          {stage === "working" ? "Syncing…" : "Sync complete"}
        </h1>
        <p className="mt-2 text-sm text-[var(--ash)]">
          {stage === "working"
            ? "Please wait while we synchronize your changes."
            : "All set. Taking you back…"}
        </p>

        <button
          onClick={() => router.push(from)}
          className="mt-6 w-full rounded-lg bg-[var(--clay)] px-4 py-2 text-white hover:opacity-90"
          type="button"
        >
          {stage === "working" ? "Continue in background" : "Back now"}
        </button>
      </div>

      {/* <p className="mt-4 text-xs text-[var(--ash)]">
        This is a visual preview—no data is synced yet.
      </p> */}
    </main>
  );
}
