"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
    let stream: MediaStream | null = null;
    const v = videoRef.current;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (v) {
          v.srcObject = stream;
          await v.play();
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Camera access denied");
      }
    })();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function makeThumbnail(video: HTMLVideoElement): string {
    const maxW = 800;
    const ratio = (video.videoWidth || 1) / (video.videoHeight || 1);
    const w = Math.min(maxW, video.videoWidth || maxW);
    const h = Math.round(w / ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.5);
  }

  async function captureAndProcess() {
    setError("");
    setBusy(true);
    try {
      const video = videoRef.current;
      if (!video) throw new Error("No camera stream");

      const dataUrl = makeThumbnail(video);
      setPreview(dataUrl);

      const blob = await (await fetch(dataUrl)).blob();
      const { data } = await Tesseract.recognize(blob, "eng");
      const ocrText = data.text || "";

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

      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      const refDoc = await addDoc(collection(db, "registrations"), {
        createdBy: user.uid,
        method: "scan",
        createdAt: serverTimestamp(),
        status: "draft",
        imageUrl: null,
        imagePath: null,
        ocrText,
        thumbnailDataUrl: dataUrl,
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

      router.push(`/champion/registration/${refDoc.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to process image");
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
          <div className="mt-4 overflow-hidden rounded border">
            <Image
              src={preview}
              alt="preview"
              width={800}
              height={500}
              className="h-auto w-full object-cover"
              unoptimized
            />
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
      <p className="mt-4 text-sm text-[var(--ash)]">
        Snap → read → save. Your scan and text stay together for easy review.
      </p>
    </main>
  );
}
