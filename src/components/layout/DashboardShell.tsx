import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions, Role } from "@/lib/auth";

const navItemsByRole: Record<Role, { href: string; label: string }[]> = {
  [Role.SUPERADMIN]: [
    { href: "/dashboard/super-admin", label: "Overview" },
    { href: "/dashboard/admin", label: "Admin View" },
    { href: "/dashboard/teacher", label: "Teacher View" },
  ],
  [Role.ADMIN]: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/teacher", label: "Teacher View" },
  ],
  [Role.TEACHER]: [
    { href: "/dashboard/teacher", label: "Overview" },
  ],
};

export default async function DashboardShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const session = await getServerSession(authOptions);

  const role = session?.user.role ?? Role.TEACHER;
  const navItems = navItemsByRole[role] ?? [];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-800/80 bg-slate-950/80 px-4 py-6 md:flex">
        <div className="mb-8 px-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            ID Card
          </div>
          <div className="mt-1 text-sm font-medium text-slate-300">
            Automation Studio
          </div>
        </div>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-2 pt-6 text-xs text-slate-500">
          Signed in as
          <div className="font-medium text-slate-200">
            {session?.user.email ?? "Unknown"}
          </div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {role}
          </div>
        </div>
      </aside>
      <main className="flex-1">
        <header className="border-b border-slate-800 bg-slate-950/70 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-semibold text-slate-50 md:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-xs text-slate-400 md:text-sm">
                  {subtitle}
                </p>
              )}
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-sky-500 hover:bg-slate-900/80"
            >
              Sign out
            </Link>
          </div>
        </header>
        <div className="px-4 py-6 md:px-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}

