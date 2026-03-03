import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./signin-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role) {
    if (session.user.role === "SUPERADMIN") {
      redirect("/dashboard/super-admin");
    }
    if (session.user.role === "ADMIN") {
      redirect("/dashboard/admin");
    }
    if (session.user.role === "TEACHER") {
      redirect("/dashboard/teacher");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 p-8 shadow-2xl ring-1 ring-slate-800">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-50">
            ID Card Automation
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in with your admin or teacher account.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

