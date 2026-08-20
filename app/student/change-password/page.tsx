"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import PasswordInput from "@/components/shared/PasswordInput";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/student/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      router.push("/student/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl px-4 pt-16 pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
        <p className="text-xs font-semibold tracking-[0.42em] text-[#1e56d8]">
          SECURITY
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-[#191d25]">
          Change Password
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-[#485c73]">
          Please update your password to continue.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Old Password
            </label>
            <PasswordInput
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
              placeholder="Old password"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              New Password
            </label>
            <PasswordInput
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
              placeholder="New password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
