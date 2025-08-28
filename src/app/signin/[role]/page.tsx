"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Field } from "@/components/ui";

type Role = "champion" | "officer" | "admin";

const MAP: Record<Role, { label: string; emoji: string; dest: string }> = {
  champion: { label: "Champion", emoji: "🛡️", dest: "/champion" },
  officer: { label: "Hub Officer", emoji: "🏢", dest: "/officer" },
  admin: { label: "Admin", emoji: "⚙️", dest: "/admin" },
};

const isRole = (x: unknown): x is Role =>
  x === "champion" || x === "officer" || x === "admin";

export default function SignInByRole() {
  const params = useParams();
  const router = useRouter();

  const roleParam = Array.isArray(params.role)
    ? params.role[0]
    : (params.role as string | undefined);
  const valid = isRole(roleParam);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!valid) router.replace("/select-role");
  }, [valid, router]);

  if (!valid) return null;

  const meta = MAP[roleParam];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.push(meta.dest);
  };

  return (
    <main className="max-w-md">
      <Link href="/select-role" className="text-sm text-[var(--clay)]">
        ← Back
      </Link>
      <Card className="mt-3">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-2xl">{meta.emoji}</span>
          <h1
            style={{ fontFamily: "var(--font-head)" }}
            className="text-xl font-semibold"
          >
            {meta.label} Sign in
          </h1>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Field
            label={`${meta.label} email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button className="w-full">Continue</Button>
          <div className="hint text-xs">
            Preview flow: any input proceeds to the {meta.label} dashboard.
          </div>
        </form>
      </Card>
    </main>
  );
}
