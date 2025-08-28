"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type Role = "champion" | "hub-officer" | "admin";

type Props = {
  allow: Role[];
  children: React.ReactNode;
  redirectTo?: string; // default /login
};

export default function RoleGate({
  allow,
  children,
  redirectTo = "/login",
}: Props) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setOk(false);
        router.replace(redirectTo);
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.exists()
        ? (snap.data().role as Role | undefined)
        : undefined;
      if (role && allow.includes(role)) {
        setOk(true);
      } else {
        setOk(false);
        router.replace("/login");
      }
    });
    return () => unsub();
  }, [router, allow, redirectTo]);

  if (ok === null) return <div className="p-6">Checking access…</div>;
  if (!ok) return null;
  return <>{children}</>;
}
