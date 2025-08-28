import * as admin from "firebase-admin";
import * as fs from "fs";

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-admin.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Roles to create
const roles = [
  { id: "hub-officer", name: "Hub Officer" },
  { id: "champion", name: "Champion" },
  { id: "admin", name: "Admin" },
];

// Users to create
const users = [
  { uid: "uid1", email: "kadeeja@example.com", role: "hub-officer" },
  { uid: "uid2", email: "chilli@example.com", role: "champion" },
  { uid: "uid3", email: "admin@example.com", role: "admin" },
];

async function bootstrapFirestore() {
  console.log("Creating roles...");
  for (const r of roles) {
    const roleRef = db.collection("roles").doc(r.id);
    const roleSnap = await roleRef.get();
    if (!roleSnap.exists) {
      await roleRef.set(r);
      console.log(`Created role: ${r.name}`);
    } else {
      console.log(`Role already exists: ${r.name}`);
    }
  }

  console.log("Creating users...");
  for (const u of users) {
    const userRef = db.collection("users").doc(u.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        email: u.email,
        role: u.role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created user: ${u.email}`);
    } else {
      console.log(`User already exists: ${u.email}`);
    }
  }

  console.log("Firestore bootstrapping complete!");
}

bootstrapFirestore().catch(console.error);
