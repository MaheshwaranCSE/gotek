"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Student = {
  id: string;
  name: string;
  originalImage: string | null;
  enhancedImage: string | null;
};

export default function StudentImageEditorPage() {
  const params = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [brightness, setBrightness] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      const res = await fetch(`/api/students/${params.id}`);
      if (!res.ok) return;
      const json = await res.json();
      setStudent(json.student);
    };
    loadStudent();
  }, [params.id]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const processImage = async () => {
    if (!file) return;
    setProcessing(true);
    setStatus(null);

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/images/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: base64,
        brightness,
        width: 400,
        height: 600,
      }),
    });

    if (!res.ok) {
      setStatus("Failed to process image.");
      setProcessing(false);
      return;
    }

    const json = await res.json();

    await fetch(`/api/students/${params.id}/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enhancedImage: json.url }),
    });

    setStatus("Image processed and saved.");
    setProcessing(false);
    setStudent((prev) =>
      prev ? { ...prev, enhancedImage: json.url, originalImage: prev.originalImage ?? json.url } : prev,
    );
  };

  if (!student) {
    return (
      <p className="text-sm text-slate-300">
        Loading student details...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">
          Image enhancement for {student.name}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload or adjust the student photo and preview the before/after result.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <label className="block text-xs font-medium text-slate-200">
            Upload new photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-sky-400"
          />
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-300">
              <span>Auto brightness</span>
              <span>{brightness.toFixed(2)}x</span>
            </label>
            <input
              type="range"
              min={0.6}
              max={1.4}
              step={0.05}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            type="button"
            disabled={!file || processing}
            onClick={processImage}
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {processing ? "Processing..." : "Run enhancement"}
          </button>
          {status && (
            <p className="text-xs font-medium text-slate-300">{status}</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Before / After
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-300">Before</p>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
                {student.originalImage || previewUrl ? (
                  <Image
                    src={previewUrl ?? student.originalImage ?? ""}
                    alt="Original"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                    No image yet
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-300">After</p>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
                {student.enhancedImage ? (
                  <Image
                    src={student.enhancedImage}
                    alt="Enhanced"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                    Run enhancement to see result
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

