"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, Button, Field, TextArea } from "@/components/ui";

export default function DigitalRegistrationPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    entryNumber: "",
    childName: "",
    sex: "",
    father_name: "",
    father_occupation: "",
    father_nationality: "",
    father_religion: "",
    mother_maidenName: "",
    mother_nationality: "",
    born_when: "",
    born_where: "",
    informant: "",
    notes: "",
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    try {
      setBusy(true);
      setError("");
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");
      const ref = await addDoc(collection(db, "registrations"), {
        createdBy: user.uid,
        method: "digital",
        createdAt: serverTimestamp(),
        status: "submitted",
        entryNumber: form.entryNumber || null,
        childName: form.childName || null,
        sex: form.sex || null,
        father: {
          name: form.father_name || null,
          occupation: form.father_occupation || null,
          nationality: form.father_nationality || null,
          religion: form.father_religion || null,
        },
        mother: {
          maidenName: form.mother_maidenName || null,
          nationality: form.mother_nationality || null,
        },
        born: { when: form.born_when || null, where: form.born_where || null },
        informant: form.informant || null,
        notes: form.notes || null,
      });
      router.push(`/champion/registration/${ref.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-xl">
      <h1
        style={{ fontFamily: "var(--font-head)" }}
        className="mb-4 text-xl font-semibold"
      >
        Digital Registration
      </h1>
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Entry Number"
            value={form.entryNumber}
            onChange={(e) => set("entryNumber", e.currentTarget.value)}
          />
          <Field
            label="Child's Name"
            value={form.childName}
            onChange={(e) => set("childName", e.currentTarget.value)}
          />
          <Field
            label="Sex (M/F/Other)"
            value={form.sex}
            onChange={(e) => set("sex", e.currentTarget.value)}
          />
          <Field
            label="Father's Name"
            value={form.father_name}
            onChange={(e) => set("father_name", e.currentTarget.value)}
          />
          <Field
            label="Father's Occupation"
            value={form.father_occupation}
            onChange={(e) => set("father_occupation", e.currentTarget.value)}
          />
          <Field
            label="Father's Nationality"
            value={form.father_nationality}
            onChange={(e) => set("father_nationality", e.currentTarget.value)}
          />
          <Field
            label="Father's Religion"
            value={form.father_religion}
            onChange={(e) => set("father_religion", e.currentTarget.value)}
          />
          <Field
            label="Mother's Maiden Name"
            value={form.mother_maidenName}
            onChange={(e) => set("mother_maidenName", e.currentTarget.value)}
          />
          <Field
            label="Mother's Nationality"
            value={form.mother_nationality}
            onChange={(e) => set("mother_nationality", e.currentTarget.value)}
          />
          <Field
            label="When Born (YYYY-MM-DD)"
            value={form.born_when}
            onChange={(e) => set("born_when", e.currentTarget.value)}
          />
          <Field
            label="Where Born"
            value={form.born_where}
            onChange={(e) => set("born_where", e.currentTarget.value)}
          />
          <Field
            label="Informant"
            value={form.informant}
            onChange={(e) => set("informant", e.currentTarget.value)}
          />
          <div className="md:col-span-2">
            <TextArea
              label="Notes"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-8 items-center">
          <Button onClick={submit} disabled={busy}>
            {busy ? "Saving…" : "Submit"}
          </Button>
          {error && (
            <span className="text-[var(--sunset)] text-sm">{error}</span>
          )}
        </div>
      </Card>
    </main>
  );
}
