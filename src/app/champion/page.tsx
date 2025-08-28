"use client";

import Link from "next/link";
import { Card, Button } from "@/components/ui";

export default function ChampionDashboard() {
  return (
    <main>
      <h1
        style={{ fontFamily: "var(--font-head)" }}
        className="mb-4 text-2xl font-bold"
      >
        Champion Dashboard
      </h1>

      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[var(--ash)]">Quick actions</p>
          <p>Register a new child or view recent records.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/champion/register">
            <Button>➕ New registration</Button>
          </Link>
          <Link href="/champion/records">
            <Button variant="muted">📑 View records</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
