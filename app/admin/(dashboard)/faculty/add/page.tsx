"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/SmartImage";

type Faculty = {
  _id?: string;
  name: string;
  profession: string;
  image: string;
  email: string;
  experience: string;
  specialization: string;
  about: string;
};

const initialForm: Faculty = {
  name: "",
  profession: "",
  image: "",
  email: "",
  experience: "",
  specialization: "",
  about: "",
};

export default function AdminFacultyPage() {
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);

  const [form, setForm] = useState<Faculty>(initialForm);
  const previewImage = normalizeImageUrl(form.image);

  const fetchFaculty = async () => {
    const res = await fetch("/api/faculty");
    const data = await res.json();
    setFacultyList(data);
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

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          image: normalizeImageUrl(form.image),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert(
        isEditMode
          ? "Faculty updated successfully!"
          : "Faculty added successfully!"
      );
      handleReset();
      fetchFaculty();
    } catch {
      alert(editingFacultyId ? "Error updating faculty" : "Error adding faculty");
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
    });

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
          {facultyList.map((faculty, index) => (
            <div
              key={faculty._id ?? `${faculty.email}-${index}`}
              className="border rounded-xl p-4 flex gap-4 items-center"
            >
              <SmartImage
                key={normalizeImageUrl(faculty.image)}
                src={normalizeImageUrl(faculty.image)}
                alt={faculty.name}
                className="w-20 h-20 object-cover rounded-full"
              />

              <div className="flex-1">
                <h3 className="font-bold">{faculty.name}</h3>
                <p className="text-sm text-gray-500">{faculty.profession}</p>
                <p className="text-xs text-gray-400">{faculty.specialization}</p>
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
          ))}
        </div>

        {facultyList.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No faculty added yet.</p>
        )}
      </div>
    </section>
  );
}
