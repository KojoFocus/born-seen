"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, Button, Field } from "@/components/ui";

type RegDoc = {
  id: string;
  childName?: string;
  entryNumber?: string;
  method?: "digital" | "scan";
  createdAt?: { seconds: number; nanoseconds: number };
  thumbnailDataUrl?: string | null;
  imageUrl?: string | null;
  status?: string;
};

export default function ChampionRecordsPage() {
  const [all, setAll] = useState<RegDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "digital" | "scan">("all");
  const [qText, setQText] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setAll([]);
        setLoading(false);
        return;
      }

      const qq = query(
        collection(db, "registrations"),
        where("createdBy", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(qq);
      const rows: RegDoc[] = snap.docs.map((d) => {
        const data = d.data() as DocumentData;
        return {
          id: d.id,
          childName: data.childName,
          entryNumber: data.entryNumber,
          method: data.method,
          createdAt: data.createdAt,
          thumbnailDataUrl: data.thumbnailDataUrl ?? null,
          imageUrl: data.imageUrl ?? null,
          status: data.status,
        };
      });
      setAll(rows);
      setLoading(false);
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    let r = all;
    if (tab !== "all") r = r.filter((x) => x.method === tab);
    if (qText.trim()) {
      const t = qText.trim().toLowerCase();
      r = r.filter(
        (x) =>
          (x.childName || "").toLowerCase().includes(t) ||
          (x.entryNumber || "").toLowerCase().includes(t)
      );
    }
    return r;
  }, [all, tab, qText]);

  const stats = useMemo(() => {
    const digital = all.filter((x) => x.method === "digital").length;
    const scan = all.filter((x) => x.method === "scan").length;
    return { total: all.length, digital, scan };
  }, [all]);

  return (
    <main>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1
            style={{ fontFamily: "var(--font-head)" }}
            className="text-2xl font-bold"
          >
            My Records
          </h1>
          <p className="text-[var(--ash)]">
            Search, filter, and open registrations.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/champion/register">
            <Button>➕ New registration</Button>
          </Link>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ash)]">Total</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-xl bg-[#F4EDE7] px-3 py-1 text-sm text-[var(--clay)]">
            All
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ash)]">Digital</p>
            <p className="text-2xl font-semibold">{stats.digital}</p>
          </div>
          <div className="rounded-xl bg-[#EAF4EF] px-3 py-1 text-sm text-emerald-700">
            📝
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ash)]">Scans</p>
            <p className="text-2xl font-semibold">{stats.scan}</p>
          </div>
          <div className="rounded-xl bg-[#EFEAF7] px-3 py-1 text-sm text-purple-700">
            📷
          </div>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex overflow-hidden rounded-xl border border-[#e6e1dc]">
            <button
              onClick={() => setTab("all")}
              className={`px-4 py-2 text-sm ${
                tab === "all"
                  ? "bg-[var(--clay)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab("digital")}
              className={`px-4 py-2 text-sm ${
                tab === "digital"
                  ? "bg-[var(--clay)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              Digital
            </button>
            <button
              onClick={() => setTab("scan")}
              className={`px-4 py-2 text-sm ${
                tab === "scan"
                  ? "bg-[var(--clay)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              Scan
            </button>
          </div>
          <div className="w-full md:w-80">
            <Field
              label="Search"
              placeholder="Search by child's name or entry number"
              value={qText}
              onChange={(e) => setQText(e.currentTarget.value)}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-40 animate-pulse rounded bg-neutral-200" />
              <div className="mt-4 h-28 w-full animate-pulse rounded bg-neutral-200" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center">
          <p className="text-[var(--ash)]">No records match your filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/champion/registration/${r.id}`}
              className="block"
            >
              <Card className="group h-full">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {r.method === "scan" ? "📷" : "📝"}
                    </span>
                    <p className="font-semibold">
                      {r.childName || "Unnamed child"}
                    </p>
                  </div>
                  {r.status && (
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-[var(--ash)]">
                      {r.status}
                    </span>
                  )}
                </div>

                {(r.thumbnailDataUrl || r.imageUrl) && (
                  <div className="mb-2 overflow-hidden rounded-xl border border-[#eee6e0]">
                    <Image
                      src={(r.thumbnailDataUrl || r.imageUrl) as string}
                      alt="preview"
                      width={800}
                      height={480}
                      className="h-auto w-full object-cover transition group-hover:scale-[1.01]"
                      unoptimized
                    />
                  </div>
                )}

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-[var(--ash)]">
                  <div>
                    <span className="block text-xs uppercase tracking-wide">
                      Entry No.
                    </span>
                    <span className="text-[var(--ink)]">
                      {r.entryNumber || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wide">
                      Type
                    </span>
                    <span className="text-[var(--ink)]">
                      {r.method === "scan" ? "Scan" : "Digital"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
