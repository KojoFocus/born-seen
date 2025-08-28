import * as admin from "firebase-admin";
import * as fs from "fs";

const sa = JSON.parse(fs.readFileSync("./firebase-admin.json", "utf-8"));
if (admin.apps.length === 0)
  admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function seed(uid: string) {
  await db.collection("registrations").add({
    createdBy: uid,
    method: "digital",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "submitted",
    entryNumber: "BS-0001",
    childName: "Ama K.",
    sex: "F",
    father: {
      name: "Kojo K.",
      occupation: "Farmer",
      nationality: "Ghanaian",
      religion: "Christian",
    },
    mother: { maidenName: "Akosua A.", nationality: "Ghanaian" },
    born: { when: "2025-08-25", where: "Amdeli Clinic" },
    informant: "Midwife Mercy",
    notes: "Seed record",
  });
  console.log("Seeded registration.");
}

// Replace with the champion user's UID
seed("CHAMPION_FIREBASE_UID_HERE").catch(console.error);
