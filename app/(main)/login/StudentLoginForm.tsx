"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/shared/PasswordInput";

export default function StudentLoginForm() {
  const router = useRouter();
  const [admissionNo, setAdmissionNo] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ admissionNo, password }),
      });

      const data = (await res.json()) as {
        error?: string;
        mustChangePassword?: boolean;
      };

      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push(data.mustChangePassword ? "/student/change-password" : "/student/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)] ring-1 ring-slate-200 sm:p-7">
        <p className="text-xs font-semibold tracking-[0.42em] text-[#1e56d8]">
          LOGIN
        </p>
        <h2 className="mt-3 text-2xl font-bold text-[#191d25]">
          Student Login
        </h2>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Admission No.
            </label>
            <input
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
              placeholder="Admission no."
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
            />
            <p className="mt-2 text-xs font-medium text-slate-500">
              First login password format: <code>SVIET@XXXX</code> using the last 3-4 digits of
              your admission number.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#1f56e4]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(31,86,228,0.20)] disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
