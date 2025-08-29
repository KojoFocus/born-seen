"use client";
import { useRouter } from "next/navigation";

type Props = { className?: string; returnTo?: string };

export default function SyncNow({ className, returnTo }: Props) {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        router.push(
          `/sync${returnTo ? `?from=${encodeURIComponent(returnTo)}` : ""}`
        )
      }
      className={`rounded-lg border border-[var(--clay)] px-3 py-2 text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white transition ${
        className ?? ""
      }`}
      title="Sync pending changes (UI only)"
    >
      Sync now
    </button>
  );
}
