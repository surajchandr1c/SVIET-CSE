"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/SmartImage";

type TechxploreStudent = {
  _id?: string;
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
};

const initialForm: TechxploreStudent = {
  name: "",
  position: "",
  image: "",
  admissionNo: "",
  batch: "",
};

export default function AdminTechxplorePage() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<TechxploreStudent[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [form, setForm] = useState<TechxploreStudent>(initialForm);
  const previewImage = normalizeImageUrl(form.image);

  const fetchStudents = async () => {
    const res = await fetch("/api/techxplore");
    const data = await res.json();
    setStudents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setEditingStudentId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditMode = Boolean(editingStudentId);
      const endpoint = isEditMode
        ? `/api/techxplore/${editingStudentId}`
        : "/api/techxplore";

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: normalizeImageUrl(form.image),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert(
        isEditMode
          ? "TechXplore student updated successfully!"
          : "TechXplore student added successfully!"
      );
      handleReset();
      fetchStudents();
    } catch {
      alert(
        editingStudentId
          ? "Error updating TechXplore student"
          : "Error adding TechXplore student"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: TechxploreStudent) => {
    if (!student._id) return;

    setEditingStudentId(student._id);
    setForm({
      name: student.name,
      position: student.position,
      image: student.image,
      admissionNo: student.admissionNo,
      batch: student.batch,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/techxplore/${id}`, { method: "DELETE" });
    if (!res.ok) return;

    if (editingStudentId === id) {
      handleReset();
    }

    fetchStudents();
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-6xl admin-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
          TechXplore
        </p>
        <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
          Manage TechXplore
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
          Add and maintain student data for the TechXplore page.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          {editingStudentId ? "Edit TechXplore Student" : "Add TechXplore Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full rounded-lg border px-4 py-2"
              required
            />
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              name="admissionNo"
              value={form.admissionNo}
              onChange={handleChange}
              placeholder="Admission No."
              className="w-full rounded-lg border px-4 py-2"
              required
            />
            <input
              type="text"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="Batch"
              className="w-full rounded-lg border px-4 py-2"
              required
            />
          </div>

          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Paste Google Drive image link"
            className="w-full rounded-lg border px-4 py-2"
            required
          />

          {form.image && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">Preview:</p>
              <SmartImage
                key={previewImage}
                src={previewImage}
                alt="Preview"
                className="h-32 w-32 rounded-lg border object-cover"
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border px-6 py-2"
            >
              {editingStudentId ? "Cancel Edit" : "Reset"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
            >
              {loading
                ? editingStudentId
                  ? "Updating..."
                  : "Adding..."
                : editingStudentId
                  ? "Update Student"
                  : "Add Student"}
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">TechXplore Student List</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {students.map((student, index) => (
            <div
              key={student._id ?? `${student.admissionNo}-${index}`}
              className="flex items-center gap-4 rounded-xl border p-4"
            >
              <SmartImage
                key={normalizeImageUrl(student.image)}
                src={normalizeImageUrl(student.image)}
                alt={student.name}
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="flex-1">
                <h3 className="font-bold">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.position}</p>
                <p className="text-xs text-gray-400">
                  {student.admissionNo} | {student.batch}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => student._id && handleDelete(student._id)}
                  disabled={!student._id}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <p className="mt-6 text-center text-gray-500">No students added yet.</p>
        )}
      </div>
    </section>
  );
}
