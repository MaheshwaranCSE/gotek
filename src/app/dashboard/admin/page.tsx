import DashboardShell from "@/components/layout/DashboardShell";

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Oversee templates, batches, and staff usage for your institution."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">
            Active ID Templates
          </h2>
          <p className="mt-3 text-2xl font-semibold text-slate-50">5</p>
          <p className="mt-1 text-xs text-slate-400">
            Manage front/back layouts and variable bindings.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">
            Pending Batches
          </h2>
          <p className="mt-3 text-2xl font-semibold text-slate-50">7</p>
          <p className="mt-1 text-xs text-slate-400">
            Approve and finalize student cards before print.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

