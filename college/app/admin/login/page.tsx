"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#173f66_0%,#0f2746_38%,#08152d_100%)] px-4">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-cyan-300/25 bg-[#0f1f3f]/85 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-200">Secure Access</p>
        <h2 className="mb-6 text-3xl font-bold text-slate-100">Admin Login</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300/30 bg-red-500/15 p-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-cyan-300/25 bg-[#0a1833] px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-cyan-300/25 bg-[#0a1833] px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#175f84] to-[#1a6f98] py-2.5 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
