"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Tesseract from "tesseract.js";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e: any) {
        setError(e?.message || "Camera access denied");
      }
    })();
    return () => {
      const tracks = (
        videoRef.current?.srcObject as MediaStream | null
      )?.getTracks();
      tracks?.forEach((t) => t.stop());
    };
  }, []);

  function makeThumbnail(video: HTMLVideoElement): string {
    // Downscale to keep Firestore doc tiny
    const maxW = 800;
    const ratio = (video.videoWidth || 1) / (video.videoHeight || 1);
    const w = Math.min(maxW, video.videoWidth || maxW);
    const h = Math.round(w / ratio);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, w, h);
    // Quality 0.5 keeps data URL small; lower if needed
    return canvas.toDataURL("image/jpeg", 0.5);
  }

  async function captureAndProcess() {
    setError("");
    setBusy(true);
    try {
      const video = videoRef.current;
      if (!video) throw new Error("No camera stream");

      // 1) Thumbnail for preview + Firestore
      const dataUrl = makeThumbnail(video);
      setPreview(dataUrl);

      // 2) OCR on the thumbnail
      const blob = await (await fetch(dataUrl)).blob();
      const { data } = await Tesseract.recognize(blob, "eng");
      const ocrText = data.text || "";

      // 3) Extract likely fields
      const find = (rx: RegExp) => {
        const m = ocrText.match(rx);
        return m ? m[1].trim() : undefined;
      };

      const entryNumber = find(/Entry\s*No\.?\s*[:\-]?\s*(.+)/i);
      const childName = find(/Child(?:'s)?\s*Name\s*[:\-]?\s*(.+)/i);
      const sex = find(/Sex\s*[:\-]?\s*(Male|Female|M|F|Other)/i);
      const fatherName = find(/Father(?:'s)?\s*Name\s*[:\-]?\s*(.+)/i);
      const fatherOcc = find(/Father(?:'s)?\s*Occupation\s*[:\-]?\s*(.+)/i);
      const fatherNat = find(/Father(?:'s)?\s*Nationality\s*[:\-]?\s*(.+)/i);
      const fatherRel = find(/Father(?:'s)?\s*Religion\s*[:\-]?\s*(.+)/i);
      const motherMaiden = find(
        /Mother(?:'s)?\s*Maiden\s*Name\s*[:\-]?\s*(.+)/i
      );
      const motherNat = find(/Mother(?:'s)?\s*Nationality\s*[:\-]?\s*(.+)/i);
      const bornWhen =
        find(/When\s*Born\s*[:\-]?\s*(.+)/i) ||
        find(/DOB|Date\s*of\s*Birth\s*[:\-]?\s*(.+)/i);
      const bornWhere = find(/Where\s*Born\s*[:\-]?\s*(.+)/i);
      const informant = find(/Informant\s*[:\-]?\s*(.+)/i);

      // 4) Save ONE Firestore doc (no Storage fields)
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      const refDoc = await addDoc(collection(db, "registrations"), {
        createdBy: user.uid,
        method: "scan",
        createdAt: serverTimestamp(),
        status: "draft",

        // Storage disabled; keep nulls for compatibility
        imageUrl: null,
        imagePath: null,

        // OCR & optional tiny preview
        ocrText,
        thumbnailDataUrl: dataUrl, // remove if you want the smallest possible doc

        // Structured fields
        entryNumber: entryNumber || null,
        childName: childName || null,
        sex: sex || null,
        father: {
          name: fatherName || null,
          occupation: fatherOcc || null,
          nationality: fatherNat || null,
          religion: fatherRel || null,
        },
        mother: {
          maidenName: motherMaiden || null,
          nationality: motherNat || null,
        },
        born: { when: bornWhen || null, where: bornWhere || null },
        informant: informant || null,
      });

      // Go to details page where they can review / edit fields
      router.push(`/champion/registration/${refDoc.id}`);
    } catch (e: any) {
      setError(e?.message || "Failed to process image");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-semibold">Scan Handwritten Form</h1>

      <div className="rounded-2xl border p-4">
        <video
          ref={videoRef}
          className="w-full rounded bg-black"
          muted
          playsInline
        />
        <button
          onClick={captureAndProcess}
          disabled={busy}
          className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "Processing…" : "Capture & Extract"}
        </button>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 w-full rounded border"
          />
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <p className="mt-4 text-sm text-[var(--ash)]">
        Snap → read → save. Your scan and text stay together for easy review.
      </p>
    </main>
  );
}
