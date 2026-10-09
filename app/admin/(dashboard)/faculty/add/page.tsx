"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/shared/SmartImage";
import AdminPageIntroCard from "@/components/admin/AdminPageIntroCard";
import { compareFacultyByPositionThenCreatedAtDesc } from "@/lib/facultyOrder";
import { AdminCardListSkeleton } from "@/components/shared/Skeleton";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orderLoadingId, setOrderLoadingId] = useState<string | null>(null);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FacultyForm>(initialForm);
  const previewImage = normalizeImageUrl(form.image);

  const fetchFaculty = async () => {
    try {
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
    } finally {
      setInitialLoading(false);
    }
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
    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be 5 MB or smaller.");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/faculty/image", {
        method: "POST",
        credentials: "include",
        body: uploadData,
      });

      const data = (await res.json()) as { image?: string; error?: string };
      if (!res.ok || !data.image) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setForm((prev) => ({ ...prev, image: data.image! }));
      setUploadSuccess("Image uploaded successfully to Cloudinary!");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (uploadingImage) {
      alert("Please wait for the image upload to complete.");
      return;
    }

    if (!form.image.trim()) {
      alert("Please upload a faculty image.");
      return;
    }

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

    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

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
      <AdminPageIntroCard
        kicker="Faculty"
        title="Manage Faculty"
        description="Add, update and organize department faculty profiles."
      />

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

          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 transition-colors">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Faculty Image <span className="text-red-500">*</span>
                </label>
                {uploadingImage && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading to Cloudinary...
                  </span>
                )}
              </div>

              {form.image ? (
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
                  <SmartImage
                    src={previewImage}
                    alt="Uploaded faculty image"
                    className="h-20 w-20 rounded-xl border border-gray-100 object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-[200px]">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      Uploaded to Cloudinary
                    </p>
                    <p className="mt-1 max-w-md truncate text-xs text-gray-400" title={form.image}>
                      {form.image}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={uploadingImage || loading}
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        disabled={uploadingImage || loading}
                        onClick={handleRemoveImage}
                        className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-7 px-4 text-center transition ${
                    uploadingImage
                      ? "border-blue-400 bg-blue-50/30"
                      : "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50/20"
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-600" />
                      <p className="text-sm font-semibold text-blue-700">
                        Uploading image to Cloudinary...
                      </p>
                      <p className="mt-1 text-xs text-blue-500">
                        Please wait a moment
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-800">
                        Click to upload faculty image
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, WebP up to 5 MB • Automatically saved to Cloudinary
                      </p>
                    </>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || loading}
                className="hidden"
              />

              {uploadSuccess && (
                <p className="text-xs font-medium text-emerald-600">{uploadSuccess}</p>
              )}
              {uploadError && (
                <p className="text-xs font-medium text-red-600">{uploadError}</p>
              )}
            </div>
          </div>

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
              disabled={loading || uploadingImage}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading
                ? editingFacultyId
                  ? "Updating..."
                  : "Adding..."
                : uploadingImage
                  ? "Uploading Image..."
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

        {initialLoading ? (
          <AdminCardListSkeleton />
        ) : facultyList.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No faculty added yet.</p>
        )}
      </div>
    </section>
  );
}
