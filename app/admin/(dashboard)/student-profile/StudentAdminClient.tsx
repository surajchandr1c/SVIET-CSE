"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminPagination from "@/components/admin/AdminPagination";

type StudentRow = {
  _id?: string;
  name: string;
  admissionNo: string;
  semester: number;
  mustChangePassword?: boolean;
  createdAt?: string;
};

type StudentsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  students: StudentRow[];
  error?: string;
};

export default function StudentAdminClient() {
  const [semester, setSemester] = useState(4);
  const [admissionNo, setAdmissionNo] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudentsResponse | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("semester", String(semester));
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (admissionNo.trim()) params.set("admissionNo", admissionNo.trim());
    return params.toString();
  }, [semester, page, limit, admissionNo]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/students?${query}`, { cache: "no-store" });
      const json = (await res.json()) as StudentsResponse;
      if (!res.ok) throw new Error(json.error || "Failed to fetch students");
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch students");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const resetPassword = async (admission: string) => {
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionNo: admission }),
      });
      const json = (await res.json()) as { newPassword?: string; error?: string; name?: string };
      if (!res.ok) throw new Error(json.error || "Failed to reset password");
      alert(`${admission} (${json.name ?? "Student"}) new password: ${json.newPassword}`);
      fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  return (
    <section className="space-y-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="admin-card p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
                Student Profile
              </p>
              <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
                Students
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
                Search and reset passwords for student accounts.
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)]"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-[180px_1fr_auto]">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[var(--admin-text)]">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => {
                  setPage(1);
                  setSemester(Number(e.target.value));
                }}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-text)]"
              >
                <option value={0}>All</option>
                <option value={4}>4th</option>
                <option value={6}>6th</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[var(--admin-text)]">
                Admission No
              </label>
              <input
                value={admissionNo}
                onChange={(e) => {
                  setPage(1);
                  setAdmissionNo(e.target.value);
                }}
                placeholder="e.g. 2024BTCS007"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]"
              />
            </div>

            <button
              type="button"
              onClick={fetchStudents}
              disabled={loading}
              className="h-[44px] self-end rounded-xl bg-[var(--admin-accent-strong)] px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--admin-text)]">
            Total: {data?.total ?? 0}
          </p>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Page {data?.page ?? 1} / {data?.totalPages ?? 1}
          </p>
        </div>

        {error ? (
          <div className="px-5 py-6 text-sm font-semibold text-red-500">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-[var(--admin-muted)] text-[var(--admin-text)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Admission No</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Semester</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.students ?? []).map((s) => (
                  <tr
                    key={String(s._id ?? s.admissionNo)}
                    className="border-t border-[var(--admin-border)]"
                  >
                    <td className="px-5 py-4 font-semibold text-[var(--admin-text)]">
                      {s.admissionNo}
                    </td>
                    <td className="px-5 py-4 text-[var(--admin-text)]">{s.name}</td>
                    <td className="px-5 py-4 text-[var(--admin-text)]">{s.semester}</td>
                    <td className="px-5 py-4 text-[var(--admin-text-muted)]">
                      {s.mustChangePassword ? "Must change password" : "Active"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => resetPassword(s.admissionNo)}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && (data?.students?.length ?? 0) === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-[var(--admin-text-muted)]"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          loading={loading}
          showPageCount
          onPageChange={(nextPage) => setPage(Math.max(1, nextPage))}
        />
      </div>
    </section>
  );
}
