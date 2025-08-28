import * as admin from "firebase-admin";
import * as fs from "fs";

const sa = JSON.parse(fs.readFileSync("./firebase-admin.json", "utf-8"));
if (admin.apps.length === 0)
  admin.initializeApp({ credential: admin.credential.cert(sa) });

const db = admin.firestore();
const auth = admin.auth();

const roles = [
  { id: "champion", name: "Champion" },
  { id: "hub-officer", name: "Hub Officer" },
  { id: "admin", name: "Admin" },
];

async function upsertRoles() {
  for (const r of roles) {
    const ref = db.collection("roles").doc(r.id);
    const snap = await ref.get();
    if (!snap.exists) await ref.set(r);
  }
}

async function ensureUser(
  email: string,
  role: "champion" | "hub-officer" | "admin"
) {
  let user = await auth.getUserByEmail(email).catch(() => null);
  if (!user) {
    user = await auth.createUser({
      email,
      password: "TempPass#1234",
      emailVerified: true,
    });
  }
  await db
    .collection("users")
    .doc(user!.uid)
    .set(
      { email, role, createdAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  console.log(`User ensured: ${email} (${role})`);
}

async function main() {
  await upsertRoles();
  await ensureUser("admin@example.com", "admin");
  await ensureUser("champion@example.com", "champion");
  await ensureUser("officer@example.com", "hub-officer");
  console.log("Bootstrap complete.");
}

main().catch(console.error);
