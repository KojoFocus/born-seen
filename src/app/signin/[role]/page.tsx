"use client";
import { useEffect, useMemo, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Field } from "@/components/ui";

type Role = "champion" | "officer" | "admin";
const MAP: Record<Role, { label: string; emoji: string; dest: string }> = {
  champion: { label: "Champion", emoji: "🛡️", dest: "/champion" },
  officer: { label: "Hub Officer", emoji: "🏢", dest: "/officer" },
  admin: { label: "Admin", emoji: "⚙️", dest: "/admin" },
};
const isRole = (x: any): x is Role =>
  ["champion", "officer", "admin"].includes(x);

export default function SignIn() {
  const params = useParams();
  const router = useRouter();
  const role = Array.isArray(params.role) ? params.role[0] : params.role;
  const valid = isRole(role);
  useEffect(() => {
    if (!valid) router.replace("/select-role");
  }, [valid, router]);
  if (!valid) return null;
  const meta = useMemo(() => MAP[role], [role]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            Preview flow: any input will proceed to the {meta.label} dashboard.
          </div>
        </form>
      </Card>
    </main>
  );
}
