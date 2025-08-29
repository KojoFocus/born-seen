"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, Button, Field } from "@/components/ui";
import SyncNow from "@/components/SyncNow";

/** Remote-focused districts (Eastern Region, GH) */
const REMOTE_DISTRICTS = [
  "Afram Plains North",
  "Afram Plains South",
  "Fanteakwa North",
  "Fanteakwa South",
  "Birim North",
  "Akyemansa",
  "Kwahu East",
] as const;
type District = (typeof REMOTE_DISTRICTS)[number];

/** ----- MOCKS (replace with Firestore later) ----- */
type QueueRow = {
  id: string;
  child: string;
  method: "Digital" | "Scan";
  submittedBy: string;
  when: string;
  district: District;
  status: "Pending" | "Needs Info" | "Approved";
};

const MOCK_TOTALS_BY_DISTRICT: Record<
  District,
  { pending: number; needsInfo: number; approvedToday: number }
> = {
  "Afram Plains North": { pending: 9, needsInfo: 2, approvedToday: 3 },
  "Afram Plains South": { pending: 7, needsInfo: 1, approvedToday: 2 },
  "Fanteakwa North": { pending: 5, needsInfo: 1, approvedToday: 1 },
  "Fanteakwa South": { pending: 4, needsInfo: 1, approvedToday: 1 },
  "Birim North": { pending: 6, needsInfo: 0, approvedToday: 2 },
  Akyemansa: { pending: 5, needsInfo: 1, approvedToday: 1 },
  "Kwahu East": { pending: 8, needsInfo: 2, approvedToday: 2 },
};

const MOCK_QUEUE: QueueRow[] = [
  {
    id: "R-20541",
    child: "Ama Boateng",
    method: "Digital",
    submittedBy: "Kotoso Champion",
    when: "1h ago",
    district: "Kwahu East",
    status: "Pending",
  },
  {
    id: "R-20540",
    child: "Kojo Mensah",
    method: "Scan",
    submittedBy: "Donkorkrom Hub",
    when: "3h ago",
    district: "Afram Plains North",
    status: "Pending",
  },
  {
    id: "R-20539",
    child: "Efua Adjei",
    method: "Digital",
    submittedBy: "Begoro Champion",
    when: "5h ago",
    district: "Fanteakwa North",
    status: "Needs Info",
  },
  {
    id: "R-20538",
    child: "Yaw Owusu",
    method: "Scan",
    submittedBy: "New Abirem Hub",
    when: "Yesterday",
    district: "Birim North",
    status: "Pending",
  },
  {
    id: "R-20537",
    child: "Abena Mensima",
    method: "Digital",
    submittedBy: "Akyem Ofoase",
    when: "2d ago",
    district: "Akyemansa",
    status: "Pending",
  },
  {
    id: "R-20536",
    child: "Kwaku Antwi",
    method: "Scan",
    submittedBy: "Tease Champion",
    when: "2d ago",
    district: "Afram Plains South",
    status: "Approved",
  },
  {
    id: "R-20535",
    child: "Akosua Sarpong",
    method: "Digital",
    submittedBy: "Nsutem Champion",
    when: "3d ago",
    district: "Fanteakwa South",
    status: "Pending",
  },
];
/** ------------------------------------------------ */

export default function OfficerDashboard() {
  const [district, setDistrict] = useState<District>("Afram Plains North");
  const [queryText, setQueryText] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "needs" | "approved">(
    "all"
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const totals = useMemo(() => MOCK_TOTALS_BY_DISTRICT[district], [district]);

  const filtered = useMemo(() => {
    let rows = MOCK_QUEUE.filter((r) => r.district === district);
    if (tab === "pending") rows = rows.filter((r) => r.status === "Pending");
    if (tab === "needs") rows = rows.filter((r) => r.status === "Needs Info");
    if (tab === "approved") rows = rows.filter((r) => r.status === "Approved");
    if (queryText.trim()) {
      const t = queryText.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.child.toLowerCase().includes(t) ||
          r.id.toLowerCase().includes(t) ||
          r.submittedBy.toLowerCase().includes(t)
      );
    }
    return rows;
  }, [district, tab, queryText]);

  const handleSelectRow = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleApproveSelected = () => {
    console.log("Approving selected registrations:", selectedRows);
    // You would add your Firestore logic here to update the status of the selected rows.
    setSelectedRows([]); // Clear selection after action
  };

  return (
    <main className="max-w-5xl">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1
            style={{ fontFamily: "var(--font-head)" }}
            className="text-2xl font-bold"
          >
            Hub Officer
          </h1>
          <p className="text-[var(--ash)]">
            Review & verify registrations from {district}.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/champion/register">
            <Button size="lg">➕ New registration</Button>
          </Link>
          <Link href="/champion/records">
            <Button size="lg" variant="muted">
              📑 All records
            </Button>
          </Link>
          <SyncNow returnTo="/officer" />
        </div>
      </div>

      {/* District selector */}
      <Card className="mb-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-[var(--ash)]">District</p>
            <div className="flex flex-wrap gap-2">
              {REMOTE_DISTRICTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={[
                    "rounded-full px-3 py-1 text-sm transition",
                    d === district
                      ? "bg-[var(--clay)] text-white"
                      : "bg-neutral-100 text-[var(--ink)] hover:bg-neutral-200",
                  ].join(" ")}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="md:justify-self-end">
            <Field
              label="Quick find"
              placeholder="Search by name / ID / champion"
              value={queryText}
              onChange={(e) => setQueryText(e.currentTarget.value)}
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ash)]">Pending</p>
            <p className="text-2xl font-semibold">{totals.pending}</p>
          </div>
          <div className="rounded-xl bg-amber-50 px-3 py-1 text-sm text-amber-700">
            Queue
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ash)]">Needs Info</p>
            <p className="text-2xl font-semibold">{totals.needsInfo}</p>
          </div>
          <div className="rounded-xl bg-red-50 px-3 py-1 text-sm text-red-700">
            Follow up
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ash)]">Approved Today</p>
            <p className="text-2xl font-semibold">{totals.approvedToday}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
            Done
          </div>
        </Card>
      </div>

      {/* Tabs + queue */}
      <Card className="mb-3">
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
              onClick={() => setTab("pending")}
              className={`px-4 py-2 text-sm ${
                tab === "pending"
                  ? "bg-[var(--clay)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setTab("needs")}
              className={`px-4 py-2 text-sm ${
                tab === "needs"
                  ? "bg-[var(--clay)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              Needs Info
            </button>
            <button
              onClick={() => setTab("approved")}
              className={`px-4 py-2 text-sm ${
                tab === "approved"
                  ? "bg-[var(--clay)] text-white"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              Approved
            </button>
          </div>

          <div className="text-sm text-[var(--ash)]">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </Card>

      {/* Queue table */}
      <Card>
        <div className="overflow-hidden rounded-xl border border-[#eee6e0]">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No registrations found for this district or filter.
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="[&>th]:bg-neutral-50 [&>th]:p-3 [&>th]:text-left [&>th]:text-[var(--ash)]">
                  <th>
                    <input type="checkbox" className="form-checkbox" />
                  </th>
                  <th className="rounded-tl-xl">ID</th>
                  <th>Child</th>
                  <th>Type</th>
                  <th>Submitted by</th>
                  <th>Status</th>
                  <th className="rounded-tr-xl">When</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i, arr) => (
                  <tr
                    key={r.id}
                    className="[&>td]:p-3 [&>td]:align-top hover:bg-neutral-50"
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedRows.includes(r.id)}
                        onChange={(e) =>
                          handleSelectRow(r.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="font-mono text-xs text-[var(--ash)]">
                      {r.id}
                    </td>
                    <td className="font-medium">{r.child}</td>
                    <td className="text-[var(--ash)]">{r.method}</td>
                    <td className="text-[var(--ash)]">{r.submittedBy}</td>
                    <td>
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs",
                          r.status === "Approved" &&
                            "bg-emerald-50 text-emerald-700",
                          r.status === "Pending" &&
                            "bg-amber-50 text-amber-700",
                          r.status === "Needs Info" && "bg-red-50 text-red-700",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className={i === arr.length - 1 ? "rounded-br-xl" : ""}>
                      {r.when}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Row actions (UI only) */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={handleApproveSelected}
            disabled={selectedRows.length === 0}
          >
            Approve selected
          </Button>
          <Button variant="muted">Request info</Button>
          <Button variant="outline">Export CSV</Button>
        </div>
      </Card>
    </main>
  );
}
