"use client";

import { useState } from "react";

type Row = {
  registrationId: string;
  name: string;
  class?: string;
  section?: string;
  bloodGroup?: string;
  dob?: string;
  phone?: string;
  address?: string;
  parentName?: string;
};

export default function BulkUploadStudentsPage() {
  const [preview, setPreview] = useState<Row[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows: Row[] = [];

    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(",").map((h) => h.trim());

    for (const line of dataLines) {
      const cols = line.split(",").map((c) => c.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = cols[i] ?? "";
      });
      rows.push({
        registrationId: row.registrationId ?? row.regId ?? "",
        name: row.name ?? "",
        class: row.class ?? "",
        section: row.section ?? "",
        bloodGroup: row.bloodGroup ?? "",
        dob: row.dob ?? "",
        phone: row.phone ?? "",
        address: row.address ?? "",
        parentName: row.parentName ?? "",
      });
    }

    setPreview(rows.slice(0, 20));
    setStatus(`Parsed ${rows.length} rows. Showing first 20.`);

    const res = await fetch("/api/students/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });

    if (!res.ok) {
      setStatus("Failed to upload students. Please check your file format.");
      return;
    }

    const json = await res.json();
    setStatus(`Successfully created ${json.count} students.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">
          Bulk Upload Students
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload a CSV file with headers like
          {" "}
          <span className="font-mono text-xs text-slate-200">
            registrationId,name,class,section,bloodGroup,dob,phone,address,parentName
          </span>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-sky-400"
        />
        {status && (
          <p className="mt-3 text-xs font-medium text-slate-300">{status}</p>
        )}

        {preview.length > 0 && (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60">
            <div className="border-b border-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Preview (first 20 rows)
            </div>
            <div className="max-h-64 overflow-auto text-xs">
              <table className="min-w-full text-left">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="px-3 py-2">Reg. ID</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-slate-800">
                      <td className="px-3 py-1.5">{row.registrationId}</td>
                      <td className="px-3 py-1.5">{row.name}</td>
                      <td className="px-3 py-1.5">{row.class}</td>
                      <td className="px-3 py-1.5">{row.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

