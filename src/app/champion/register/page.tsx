"use client";

export const prerender = false;

import Link from "next/link";
import { Card } from "@/components/ui";

export default function RegistrationChoice() {
  return (
    <main className="max-w-md">
      <h1
        style={{ fontFamily: "var(--font-head)" }}
        className="mb-4 text-xl font-semibold"
      >
        New Registration
      </h1>
      <div className="grid grid-cols-1 gap-3">
        <Link href="/champion/register/digital" className="block">
          <Card className="hover:shadow-lg transition">
            <div className="text-lg font-semibold">📝 Fill Digital Form</div>
            <div className="mt-1 text-sm text-[var(--ash)]">
              Enter details directly
            </div>
          </Card>
        </Link>
        <Link href="/champion/register/scan" className="block">
          <Card className="hover:shadow-lg transition">
            <div className="text-lg font-semibold">
              📷 Scan Handwritten Form
            </div>
            <div className="mt-1 text-sm text-[var(--ash)]">
              Capture and extract text
            </div>
          </Card>
        </Link>
      </div>
    </main>
  );
}
