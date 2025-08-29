"use client";

import Link from "next/link";
import { Card, Button } from "@/components/ui";
import SyncNow from "@/components/SyncNow";

export default function ChampionDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 lg:p-24">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold md:text-4xl">
          Champion Dashboard
        </h1>

        <Card className="mb-6 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-gray-500">Quick actions</p>
            <p className="mt-1 text-base">
              Register a new child or view recent records.
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-4 md:flex-row">
          <Link href="/champion/register" passHref legacyBehavior>
            <Button className="w-full flex-grow" size="lg">
              <span className="mr-2">➕</span> New registration
            </Button>
          </Link>
          <Link href="/champion/records" passHref legacyBehavior>
            <Button variant="outline" className="w-full flex-grow" size="lg">
              <span className="mr-2">📑</span> View records
            </Button>
          </Link>
          <SyncNow returnTo="/champion" />
        </div>
      </div>
    </main>
  );
}
