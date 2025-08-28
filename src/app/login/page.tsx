"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        setError("User not found in Firestore.");
        return;
      }
      const role = snap.data().role as
        | "champion"
        | "hub-officer"
        | "admin"
        | undefined;

      if (role === "champion") router.push("/champion");
      else if (role === "hub-officer") router.push("/officer");
      else if (role === "admin") router.push("/admin");
      else setError("Unknown role. Contact admin.");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-3 rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <h1 className="text-xl font-semibold">Login</h1>
        <input
          className="w-full rounded-lg border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700">
          Login
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}
