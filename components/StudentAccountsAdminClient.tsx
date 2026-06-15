"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type StudentRow = {
  _id: string;
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

type Props = {
  semesterLocked?: number;
  showHeader?: boolean;
};

export default function StudentAccountsAdminClient({
  semesterLocked,
  showHeader = true,
}: Props) {
  const semester = semesterLocked ?? 4;
  const [admissionNo, setAdmissionNo] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudentsResponse | null>(null);

  const [addName, setAddName] = useState("");
  const [addAdmissionNo, setAddAdmissionNo] = useState("");
  const [adding, setAdding] = useState(false);

  const [editing, setEditing] = useState<StudentRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editAdmissionNo, setEditAdmissionNo] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const editCardRef = useRef<HTMLDivElement | null>(null);

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

  const addStudent = async (e: FormEvent) => {
    e.preventDefault();
    const name = addName.trim();
    const admission = addAdmissionNo.trim().toUpperCase();
    if (!name || !admission) return;

    setAdding(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, admissionNo: admission, semester }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to add student");
      setAddName("");
      setAddAdmissionNo("");
      setPage(1);
      await fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to add student");
    } finally {
      setAdding(false);
    }
  };

  const resetPassword = async (row: StudentRow) => {
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: row._id, admissionNo: row.admissionNo }),
      });
      const json = (await res.json()) as { newPassword?: string; error?: string; name?: string };
      if (!res.ok) throw new Error(json.error || "Failed to reset password");
      alert(`${row.admissionNo} (${json.name ?? row.name ?? "Student"}) new password: ${json.newPassword}`);
      fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  const beginEdit = (row: StudentRow) => {
    setEditing(row);
    setEditName(row.name);
    setEditAdmissionNo(row.admissionNo);
  };

  useEffect(() => {
    if (!editing) return;
    editCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing]);

  const cancelEdit = () => {
    setEditing(null);
    setEditName("");
    setEditAdmissionNo("");
  };

  useEffect(() => {
    setAdmissionNo("");
    setPage(1);
    setAddName("");
    setAddAdmissionNo("");
    cancelEdit();
    setError(null);
    setData(null);
  }, [semester]);

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    setSavingEdit(true);
    try {
      const name = editName.trim();
      const admissionNo = editAdmissionNo.trim().toUpperCase();
      if (!name || !admissionNo) {
        alert("Name and admission no. are required.");
        return;
      }
      const res = await fetch(`/api/admin/students/${editing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, admissionNo }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to update student");
      cancelEdit();
      fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update student");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteStudent = async (row: StudentRow) => {
    const ok = window.confirm(`Delete ${row.admissionNo} (${row.name})? This cannot be undone.`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/students/${row._id}`, { method: "DELETE" });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to delete student");
      fetchStudents();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete student");
    }
  };

  return (
    <section className="space-y-6">
      {showHeader && (
        <div className="admin-card p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
            Student Accounts
          </p>
          <h2 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
            {semester}th Sem Students
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
            Search, edit, delete, and reset passwords for student accounts.
          </p>
        </div>
      )}

      {editing && (
        <div ref={editCardRef} className="admin-card p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
                Edit Student
              </p>
              <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                {editing.admissionNo} · {editing.name}
              </p>
            </div>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)] disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={submitEdit} className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[var(--admin-text)]">
                Name
              </label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[var(--admin-text)]">
                Admission No
              </label>
              <input
                value={editAdmissionNo}
                onChange={(e) => setEditAdmissionNo(e.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={savingEdit}
                className="h-[44px] cursor-pointer rounded-xl bg-[var(--admin-accent-strong)] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
              Add Student
            </p>
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
              Add a new student to {semester}th semester list.
            </p>
          </div>
        </div>

        <form onSubmit={addStudent} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--admin-text)]">
              Name
            </label>
            <input
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="Student name"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--admin-text)]">
              Admission No
            </label>
            <input
              value={addAdmissionNo}
              onChange={(e) => setAddAdmissionNo(e.target.value)}
              placeholder="e.g. 2024BTCS007"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)]"
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={adding}
              className="h-[44px] cursor-pointer rounded-xl bg-[var(--admin-accent-strong)] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
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
            className="h-[44px] cursor-pointer rounded-xl bg-[var(--admin-accent-strong)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mx-auto w-full overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--admin-text)]">
            Total: {data?.total ?? 0}
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
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.students ?? []).map((s) => (
                  <tr key={s._id} className="border-t border-[var(--admin-border)]">
                    <td className="px-5 py-4 font-semibold text-[var(--admin-text)]">
                      {s.admissionNo}
                    </td>
                    <td className="px-5 py-4 text-[var(--admin-text)]">{s.name}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(s)}
                          className="cursor-pointer rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2 text-xs font-semibold text-[var(--admin-text)] disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteStudent(s)}
                          className="cursor-pointer rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => resetPassword(s)}
                          className="cursor-pointer rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed"
                        >
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && (data?.students?.length ?? 0) === 0 && (
                  <tr>
                    <td
                      colSpan={3}
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

        <div className="flex items-center justify-between border-t border-[var(--admin-border)] px-5 py-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || (data?.page ?? 1) <= 1}
            className="cursor-pointer rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Prev
          </button>

          <p className="text-sm text-[var(--admin-text-muted)]">
            Page {data?.page ?? 1} / {data?.totalPages ?? 1}
          </p>

          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || (data?.page ?? 1) >= (data?.totalPages ?? 1)}
            className="cursor-pointer rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
