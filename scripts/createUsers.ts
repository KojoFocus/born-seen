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

// Users to create
const users = [
  { uid: "uid1", email: "kadeeja@example.com", role: "hub-officer" },
  { uid: "uid2", email: "chilli@example.com", role: "champion" },
  { uid: "uid3", email: "admin@example.com", role: "admin" },
];

async function createUsers() {
  for (const u of users) {
    await db.collection("users").doc(u.uid).set({
      email: u.email,
      role: u.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Created user: ${u.email}`);
  }
  console.log("All users created!");
}

createUsers().catch(console.error);
