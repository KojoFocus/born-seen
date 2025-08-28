"use client";
import { Card } from "@/components/ui";

export default function OfficerDashboard() {
  return (
    <main className="max-w-2xl">
      <h1
        style={{ fontFamily: "var(--font-head)" }}
        className="mb-4 text-2xl font-bold"
      >
        Hub Officer Dashboard
      </h1>

      <Card>
        <p className="text-sm text-[var(--ash)] mb-2">Overview</p>
        <p>Here you will review, verify, and approve Champion submissions.</p>
      </Card>

      <Card className="mt-4">
        <p className="text-sm text-[var(--ash)] mb-2">Tasks</p>
        <ul className="list-disc pl-6">
          <li>Check new registrations</li>
          <li>Flag incomplete forms</li>
          <li>Forward approved records to Admin</li>
        </ul>
      </Card>
    </main>
  );
}
