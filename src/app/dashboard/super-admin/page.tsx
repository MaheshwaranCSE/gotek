import DashboardShell from "@/components/layout/DashboardShell";

export default function SuperAdminDashboardPage() {
  return (
    <DashboardShell
      title="Super Admin Dashboard"
      subtitle="Manage institutions, admins, and global settings for ID card automation."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">
            Total Institutions
          </h2>
          <p className="mt-3 text-2xl font-semibold text-slate-50">3</p>
          <p className="mt-1 text-xs text-slate-400">
            Demo metric – wire real data later.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">Active Batches</h2>
          <p className="mt-3 text-2xl font-semibold text-slate-50">12</p>
          <p className="mt-1 text-xs text-slate-400">
            Track all ID card generation runs.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-medium text-slate-100">
            Print Jobs Today
          </h2>
          <p className="mt-3 text-2xl font-semibold text-slate-50">4</p>
          <p className="mt-1 text-xs text-slate-400">
            Monitor PDF generation across campuses.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

