import DashboardShell from "@/components/layout/DashboardShell";

export default function TeacherDashboardPage() {
  return (
    <DashboardShell
      title="Teacher Dashboard"
      subtitle="Quick access to student records, photos, and batch submissions."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">
            Your Recent Batches
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            This area will list batches you created for your classes (e.g.,
            Class 10A – Term 1).
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">
            Student Photo Tasks
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Track students needing photo uploads or image enhancement runs.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

