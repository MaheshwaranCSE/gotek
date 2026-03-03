"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/teacher";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: true,
      callbackUrl,
      email,
      password,
    });

    if (!result || result.error) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
          placeholder="teacher@school.com"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-400/90">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

