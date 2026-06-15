"use client";

import { useMemo, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/SmartImage";
import AdminPageIntroCard from "@/components/admin/AdminPageIntroCard";
import { compareTechxploreByOrderThenCreatedAtAsc } from "@/lib/techxploreOrder";

type TechxploreStudent = {
  _id?: string;
  name: string;
  position: string;
  order?: number | null;
  createdAt?: string | Date | null;
  image: string;
  admissionNo: string;
  batch: string;
  about: string;
  instagram: string;
  whatsapp: string;
  linkedin: string;
  github: string;
};

type TechxploreForm = Omit<TechxploreStudent, "order"> & { order: string };

const initialForm: TechxploreForm = {
  name: "",
  position: "",
  order: "",
  image: "",
  admissionNo: "",
  batch: "",
  about: "",
  instagram: "",
  whatsapp: "",
  linkedin: "",
  github: "",
};

export default function AdminTechxplorePage() {
  const [loading, setLoading] = useState(false);
  const [orderLoadingId, setOrderLoadingId] = useState<string | null>(null);
  const [students, setStudents] = useState<TechxploreStudent[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});

  const [form, setForm] = useState<TechxploreForm>(initialForm);
  const previewImage = normalizeImageUrl(form.image);

  const orderedStudents = useMemo(() => {
    const data = [...students];
    data.sort(compareTechxploreByOrderThenCreatedAtAsc);
    return data;
  }, [students]);

  const fetchStudents = async () => {
    const res = await fetch("/api/techxplore");
    const data = await res.json();
    const sorted = Array.isArray(data)
      ? [...data].sort(compareTechxploreByOrderThenCreatedAtAsc)
      : [];

    setStudents(sorted);
    setOrderDrafts(() => {
      const next: Record<string, string> = {};
      for (const item of sorted) {
        if (!item?._id) continue;
        next[item._id] = typeof item.order === "number" ? String(item.order) : "";
      }
      return next;
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

      const orderRaw = form.order.trim();
      let order: number | null = null;
      if (orderRaw.length > 0) {
        const parsed = Number(orderRaw);
        if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
          throw new Error(
            "Invalid order. Use a whole number (>= 1) or leave blank."
          );
        }
        order = parsed;
      }

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          position: form.position.trim(),
          order,
          admissionNo: form.admissionNo.trim(),
          batch: form.batch.trim(),
          about: form.about.trim(),
          instagram: form.instagram.trim(),
          whatsapp: form.whatsapp.trim(),
          linkedin: form.linkedin.trim(),
          github: form.github.trim(),
          image: normalizeImageUrl(form.image),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed");
      }

      alert(
        isEditMode
          ? "TechXplore student updated successfully!"
          : "TechXplore student added successfully!"
      );
      handleReset();
      fetchStudents();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : editingStudentId
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
      order: student.order == null ? "" : String(student.order),
      image: student.image,
      admissionNo: student.admissionNo,
      batch: student.batch,
      about: student.about ?? "",
      instagram: student.instagram ?? "",
      whatsapp: student.whatsapp ?? "",
      linkedin: student.linkedin ?? "",
      github: student.github ?? "",
    });

    setOrderDrafts((prev) => ({
      ...prev,
      [student._id!]: student.order == null ? "" : String(student.order),
    }));

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
      <AdminPageIntroCard
        kicker="TechXplore"
        title="Manage TechXplore"
        description="Add and maintain student data for the TechXplore page."
      />

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          {editingStudentId ? "Edit TechXplore Student" : "Add TechXplore Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
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
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              placeholder="Order (optional)"
              className="w-full rounded-lg border px-4 py-2"
              min={1}
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

          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="About"
            className="min-h-28 w-full rounded-lg border px-4 py-2"
            required
          />

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="url"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram link (optional)"
              className="w-full rounded-lg border px-4 py-2"
            />
            <input
              type="url"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp link (optional)"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn link (optional)"
              className="w-full rounded-lg border px-4 py-2"
            />
            <input
              type="url"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="GitHub link (optional)"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {form.image && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">Preview:</p>
              <SmartImage
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
          {orderedStudents.map((student, index) => (
            <div
              key={student._id ?? `${student.admissionNo}-${index}`}
              className="border rounded-xl p-4 flex gap-4 items-center"
            >
              <SmartImage
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
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{student.about}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Order:</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={student._id ? orderDrafts[student._id] ?? "" : ""}
                    onChange={(e) => {
                      if (!student._id) return;
                      setOrderDrafts((prev) => ({
                        ...prev,
                        [student._id!]: e.target.value,
                      }));
                    }}
                    placeholder="(last)"
                    className="w-24 rounded-md border px-2 py-1"
                    disabled={!student._id}
                  />
                  <button
                    type="button"
                    className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                    disabled={
                      !student._id ||
                      orderLoadingId === student._id ||
                      (orderDrafts[student._id] ?? "") ===
                        (typeof student.order === "number"
                          ? String(student.order)
                          : "")
                    }
                    onClick={async () => {
                      if (!student._id) return;
                      setOrderLoadingId(student._id);
                      try {
                        const draft = (orderDrafts[student._id] ?? "").trim();
                        if (draft.length > 0) {
                          const parsed = Number(draft);
                          if (
                            !Number.isFinite(parsed) ||
                            !Number.isInteger(parsed) ||
                            parsed < 1
                          ) {
                            throw new Error(
                              "Invalid order. Use a whole number (>= 1) or leave blank."
                            );
                          }
                        }
                        const order = draft.length === 0 ? null : Number(draft);

                        const res = await fetch(`/api/techxplore/${student._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ order }),
                        });

                        if (!res.ok) {
                          const data = await res.json().catch(() => null);
                          throw new Error(data?.error ?? "Failed to update order");
                        }

                        await fetchStudents();
                      } catch (error) {
                        alert(
                          error instanceof Error
                            ? error.message
                            : "Failed to update order"
                        );
                      } finally {
                        setOrderLoadingId(null);
                      }
                    }}
                  >
                    {orderLoadingId === student._id ? "Saving..." : "Save"}
                  </button>
                  <span className="text-gray-400">
                    {typeof student.order === "number"
                      ? `Current: ${student.order}`
                      : "Current: last"}
                  </span>
                </div>
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
