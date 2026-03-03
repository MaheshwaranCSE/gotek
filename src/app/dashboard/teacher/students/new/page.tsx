"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, type StudentInput } from "@/lib/validation/student";

export default function NewStudentPage() {
  const [status, setStatus] = useState<string | null>(null);

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      registrationId: "",
      name: "",
      class: "",
      section: "",
      bloodGroup: "",
      dob: "",
      phone: "",
      address: "",
      parentName: "",
    },
  });

  const onSubmit = async (values: StudentInput) => {
    setStatus(null);
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      setStatus("Failed to save student. Please try again.");
      return;
    }

    form.reset();
    setStatus("Student created successfully.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">
          New Student Record
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manually add a single student for ID card generation.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Registration ID"
            error={form.formState.errors.registrationId?.message}
          >
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("registrationId")}
            />
          </Field>
          <Field
            label="Student Name"
            error={form.formState.errors.name?.message}
          >
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("name")}
            />
          </Field>
          <Field label="Class" error={form.formState.errors.class?.message}>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("class")}
            />
          </Field>
          <Field
            label="Section"
            error={form.formState.errors.section?.message}
          >
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("section")}
            />
          </Field>
          <Field
            label="Blood Group"
            error={form.formState.errors.bloodGroup?.message}
          >
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("bloodGroup")}
            />
          </Field>
          <Field label="Date of Birth" error={form.formState.errors.dob?.message}>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("dob")}
            />
          </Field>
          <Field label="Phone" error={form.formState.errors.phone?.message}>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("phone")}
            />
          </Field>
          <Field
            label="Parent Name"
            error={form.formState.errors.parentName?.message}
          >
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
              {...form.register("parentName")}
            />
          </Field>
        </div>
        <Field label="Address" error={form.formState.errors.address?.message}>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
            {...form.register("address")}
          />
        </Field>

        {status && (
          <p className="text-xs font-medium text-slate-300">{status}</p>
        )}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save student"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-200">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-red-400/90">{error}</p>
      )}
    </div>
  );
}

