"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/select-role"), 4200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--sand)] to-white">
      {/* radial glow */}
      <div className="absolute h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(156,108,77,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative h-44 w-44 animate-logo-reveal">
          <Image
            src="/logo.png"
            alt="Born Seen"
            fill
            priority
            className="object-contain drop-shadow-lg"
          />
        </div>

        {/* Tagline */}
        <div className="mt-8 text-center">
          <p
            className="animate-text-in-1 text-3xl md:text-4xl font-bold text-[var(--ink)]"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Making Every Child Count
          </p>
          <p className="animate-text-in-2 mt-3 text-lg md:text-xl text-[var(--clay)] tracking-wide">
            From the Very First Day
          </p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-10 flex gap-2 opacity-80">
        <span className="h-2.5 w-2.5 animate-dot-slow rounded-full bg-[var(--clay)]" />
        <span className="h-2.5 w-2.5 animate-dot-slow [animation-delay:.25s] rounded-full bg-[var(--clay)]" />
        <span className="h-2.5 w-2.5 animate-dot-slow [animation-delay:.5s] rounded-full bg-[var(--clay)]" />
      </div>
    </main>
  );
}
