"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/SmartImage";
import { compareFacultyByPositionThenCreatedAtDesc } from "@/lib/facultyOrder";

type Faculty = {
  _id?: string;
  name: string;
  profession: string;
  image: string;
  email: string;
  experience: string;
  specialization: string;
  about: string;
  position?: number | null;
  createdAt?: string | Date;
};

type FacultyForm = Omit<Faculty, "_id" | "position"> & { position: string };

const initialForm: FacultyForm = {
  name: "",
  profession: "",
  image: "",
  email: "",
  experience: "",
  specialization: "",
  about: "",
  position: "",
};

export default function AdminFacultyPage() {
  const [loading, setLoading] = useState(false);
  const [orderLoadingId, setOrderLoadingId] = useState<string | null>(null);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FacultyForm>(initialForm);
  const previewImage = normalizeImageUrl(form.image);

  const fetchFaculty = async () => {
    const res = await fetch("/api/faculty");
    const data = await res.json();
    const sorted = Array.isArray(data)
      ? [...data].sort(compareFacultyByPositionThenCreatedAtDesc)
      : [];

    setFacultyList(sorted);
    setOrderDrafts(() => {
      const next: Record<string, string> = {};
      for (const item of sorted) {
        if (!item?._id) continue;
        next[item._id] =
          typeof item.position === "number" ? String(item.position) : "";
      }
      return next;
    });
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "image") {
      setForm({ ...form, image: value });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setEditingFacultyId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditMode = Boolean(editingFacultyId);
      const endpoint = isEditMode
        ? `/api/faculty/${editingFacultyId}`
        : "/api/faculty";

      const position =
        form.position.trim().length === 0 ? null : Number(form.position);

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          position,
          image: normalizeImageUrl(form.image),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed");
      }

      alert(
        isEditMode
          ? "Faculty updated successfully!"
          : "Faculty added successfully!"
      );
      handleReset();
      fetchFaculty();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : editingFacultyId
            ? "Error updating faculty"
            : "Error adding faculty"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faculty: Faculty) => {
    if (!faculty._id) return;

    setEditingFacultyId(faculty._id);
    setForm({
      name: faculty.name,
      profession: faculty.profession,
      image: faculty.image,
      email: faculty.email,
      experience: faculty.experience,
      specialization: faculty.specialization,
      about: faculty.about,
      position:
        typeof faculty.position === "number" ? String(faculty.position) : "",
    });

    setOrderDrafts((prev) => ({
      ...prev,
      [faculty._id!]:
        typeof faculty.position === "number" ? String(faculty.position) : "",
    }));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this faculty?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/faculty/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return;

    if (editingFacultyId === id) {
      handleReset();
    }

    fetchFaculty();
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-6xl admin-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
          Faculty
        </p>
        <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
          Manage Faculty
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
          Add, update and organize department faculty profiles.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          {editingFacultyId ? "Edit Faculty" : "Add Faculty"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              placeholder="Profession"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Experience"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <input
            type="number"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Order (optional)"
            className="w-full border rounded-lg px-4 py-2"
            min={1}
            step={1}
          />
          <p className="text-xs text-gray-500">
            Set a number like 1, 2, 3... Lower number shows first. Leave blank to
            place the profile at the end.
          </p>

          <input
            type="text"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Paste Google Drive image link"
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          {form.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <SmartImage
                key={previewImage}
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="About Faculty"
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border rounded-lg"
            >
              {editingFacultyId ? "Cancel Edit" : "Reset"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading
                ? editingFacultyId
                  ? "Updating..."
                  : "Adding..."
                : editingFacultyId
                  ? "Update Faculty"
                  : "Add Faculty"}
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Faculty List</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {facultyList.map((faculty, index) => {
            const imageSrc = normalizeImageUrl(faculty.image);

            return (
              <div
                key={faculty._id ?? `${faculty.email}-${index}`}
                className="border rounded-xl p-4 flex gap-4 items-center"
              >
                <SmartImage
                  src={imageSrc}
                  alt={faculty.name}
                  className="w-20 h-20 object-cover rounded-full"
                />

              <div className="flex-1">
                <h3 className="font-bold">{faculty.name}</h3>
                <p className="text-sm text-gray-500">{faculty.profession}</p>
                <p className="text-xs text-gray-400">{faculty.specialization}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Order:</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={
                      faculty._id ? orderDrafts[faculty._id] ?? "" : ""
                    }
                    onChange={(e) => {
                      if (!faculty._id) return;
                      setOrderDrafts((prev) => ({
                        ...prev,
                        [faculty._id!]: e.target.value,
                      }));
                    }}
                    placeholder="(last)"
                    className="w-24 rounded-md border px-2 py-1"
                    disabled={!faculty._id}
                  />
                  <button
                    type="button"
                    className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                    disabled={
                      !faculty._id ||
                      orderLoadingId === faculty._id ||
                      (orderDrafts[faculty._id] ?? "") ===
                        (typeof faculty.position === "number"
                          ? String(faculty.position)
                          : "")
                    }
                    onClick={async () => {
                      if (!faculty._id) return;
                      setOrderLoadingId(faculty._id);
                      try {
                        const draft = (orderDrafts[faculty._id] ?? "").trim();
                        const position = draft.length === 0 ? null : Number(draft);

                        const res = await fetch(`/api/faculty/${faculty._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ position }),
                        });

                        if (!res.ok) {
                          const data = await res.json().catch(() => null);
                          throw new Error(data?.error ?? "Failed to update order");
                        }

                        await fetchFaculty();
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
                    {orderLoadingId === faculty._id ? "Saving..." : "Save"}
                  </button>
                  <span className="text-gray-400">
                    {typeof faculty.position === "number"
                      ? `Current: ${faculty.position}`
                      : "Current: last"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faculty)}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => faculty._id && handleDelete(faculty._id)}
                  disabled={!faculty._id}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {facultyList.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No faculty added yet.</p>
        )}
      </div>
    </section>
  );
}
