"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, Button, Field } from "@/components/ui";
import SyncNow from "@/components/SyncNow";

/**
 * Remote-focused districts (Eastern Region, GH)
 */
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
const MOCK_TOTALS_BY_DISTRICT: Record<
  District,
  { registrations: number; champions: number; officers: number; admins: number }
> = {
  "Afram Plains North": {
    registrations: 142,
    champions: 5,
    officers: 2,
    admins: 2,
  },
  "Afram Plains South": {
    registrations: 127,
    champions: 4,
    officers: 2,
    admins: 2,
  },
  "Fanteakwa North": {
    registrations: 89,
    champions: 3,
    officers: 1,
    admins: 2,
  },
  "Fanteakwa South": {
    registrations: 76,
    champions: 3,
    officers: 1,
    admins: 2,
  },
  "Birim North": { registrations: 101, champions: 4, officers: 2, admins: 2 },
  Akyemansa: { registrations: 95, champions: 3, officers: 1, admins: 2 },
  "Kwahu East": { registrations: 110, champions: 4, officers: 2, admins: 2 },
};

type RecentRow = {
  id: string;
  title: string;
  district: District;
  when: string;
  status: "Approved" | "Pending" | "Flagged";
  kind: "Digital" | "Scan";
};
const MOCK_RECENT: RecentRow[] = [
  {
    id: "R-10421",
    title: "Ama Boateng — Digital",
    district: "Afram Plains North",
    when: "2h ago",
    status: "Approved",
    kind: "Digital",
  },
  {
    id: "R-10420",
    title: "Kojo Mensah — Scan",
    district: "Afram Plains South",
    when: "5h ago",
    status: "Pending",
    kind: "Scan",
  },
  {
    id: "R-10419",
    title: "Efua Adjei — Digital",
    district: "Fanteakwa North",
    when: "Yesterday",
    status: "Flagged",
    kind: "Digital",
  },
  {
    id: "R-10418",
    title: "Yaw Owusu — Scan",
    district: "Birim North",
    when: "2d ago",
    status: "Approved",
    kind: "Scan",
  },
  {
    id: "R-10417",
    title: "Abena Mensima — Digital",
    district: "Akyemansa",
    when: "2d ago",
    status: "Approved",
    kind: "Digital",
  },
  {
    id: "R-10416",
    title: "Kwaku Antwi — Scan",
    district: "Kwahu East",
    when: "3d ago",
    status: "Pending",
    kind: "Scan",
  },
  {
    id: "R-10415",
    title: "Akosua Sarpong — Digital",
    district: "Fanteakwa South",
    when: "3d ago",
    status: "Approved",
    kind: "Digital",
  },
];
/** ------------------------------------------------ */

export default function AdminDashboard() {
  const [district, setDistrict] = useState<District>("Afram Plains North");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const totals = useMemo(() => MOCK_TOTALS_BY_DISTRICT[district], [district]);
  const recent = useMemo(
    () => MOCK_RECENT.filter((r) => r.district === district),
    [district]
  );

  const stats = useMemo(
    () => [
      {
        label: "Registrations",
        value: totals.registrations,
        chip: district,
        chipClass: "bg-[#F4EDE7] text-[var(--clay)]",
      },
      {
        label: "Champions",
        value: totals.champions,
        chip: "Field",
        chipClass: "bg-[#EAF4EF] text-emerald-700",
      },
      {
        label: "Hub Officers",
        value: totals.officers,
        chip: "Hubs",
        chipClass: "bg-[#EFEAF7] text-purple-700",
      },
      {
        label: "Admins",
        value: totals.admins,
        chip: "Core",
        chipClass: "bg-[#FFEFEA] text-[var(--sunset)]",
      },
    ],
    [totals, district]
  );

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
            Admin Console
          </h1>
          <p className="text-[var(--ash)]">
            Focus: Remote districts in Eastern Region
          </p>
        </div>
        <div className="flex gap-2">
          <SyncNow returnTo="/admin" />
          <Link href="/champion/records">
            <Button size="lg" variant="muted">
              📑 View all records
            </Button>
          </Link>
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
            <Field label="Quick find" placeholder="Name / Entry No. / ID" />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--ash)]">{s.label}</p>
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
            <div className={`rounded-xl px-3 py-1 text-sm ${s.chipClass}`}>
              {s.chip}
            </div>
          </Card>
        ))}
      </div>

      {/* System actions */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="mb-1 text-lg font-semibold">User Management</h2>
            <p className="text-sm text-[var(--ash)]">
              Invite, promote, or deactivate users in {district}.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Invite user</Button>
            <Button variant="muted">Manage roles</Button>
          </div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="mb-1 text-lg font-semibold">Data Quality</h2>
            <p className="text-sm text-[var(--ash)]">
              Flag duplicates and resolve missing fields.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Run checks</Button>
            <Button variant="muted">View issues</Button>
          </div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="mb-1 text-lg font-semibold">Exports & Reports</h2>
            <p className="text-sm text-[var(--ash)]">
              Generate CSVs and summaries for {district}.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Export CSV</Button>
            <Button variant="muted">Monthly report</Button>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recent Activity — {district}
          </h2>
          <Link
            href="/champion/records"
            className="text-sm text-[var(--clay)] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#eee6e0]">
          {recent.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No recent activity found for this district.
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="[&>th]:bg-neutral-50 [&>th]:p-3 [&>th]:text-left [&>th]:text-[var(--ash)]">
                  <th>
                    <input type="checkbox" className="form-checkbox" />
                  </th>
                  <th className="rounded-tl-xl">ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="rounded-tr-xl">When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i, arr) => (
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
                    <td className="font-medium">{r.title}</td>
                    <td className="text-[var(--ash)]">{r.kind}</td>
                    <td>
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs",
                          r.status === "Approved" &&
                            "bg-emerald-50 text-emerald-700",
                          r.status === "Pending" &&
                            "bg-amber-50 text-amber-700",
                          r.status === "Flagged" && "bg-red-50 text-red-700",
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
