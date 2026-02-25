"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { normalizeImageUrl } from "@/lib/imageUrl";

type AchivementEntry = {
  _id?: string;
  heading: string;
  date: string;
  coverImageUrl: string;
  driveUrl: string;
};

const initialForm: AchivementEntry = {
  heading: "",
  date: "",
  coverImageUrl: "",
  driveUrl: "",
};

const extractGoogleDriveFolderId = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch?.[1]) return folderMatch[1];

  try {
    const parsed = new URL(trimmed);
    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
    return null;
  }

  return null;
};

const normalizeDriveUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const folderId = extractGoogleDriveFolderId(trimmed);
  if (!folderId) return trimmed;

  return `https://drive.google.com/drive/folders/${folderId}`;
};

const formatDate = (value: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminAchivementPage() {
  const [entries, setEntries] = useState<AchivementEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [form, setForm] = useState<AchivementEntry>(initialForm);

  const fetchEntries = async () => {
    const res = await fetch("/api/achivement");
    const data = await res.json();
    setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setEditingEntryId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.heading.trim() && !form.date.trim()) {
      alert("Please add at least heading or date.");
      return;
    }

    setLoading(true);

    try {
      const isEditMode = Boolean(editingEntryId);
      const endpoint = isEditMode ? `/api/achivement/${editingEntryId}` : "/api/achivement";

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: form.heading.trim(),
          date: form.date.trim(),
          coverImageUrl: normalizeImageUrl(form.coverImageUrl),
          driveUrl: normalizeDriveUrl(form.driveUrl),
        }),
      });

      if (!res.ok) throw new Error("Failed to save achivement entry");

      alert(isEditMode ? "Achivement card updated." : "Achivement card added.");
      handleReset();
      fetchEntries();
    } catch {
      alert(editingEntryId ? "Error updating achivement card" : "Error adding achivement card");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: AchivementEntry) => {
    if (!entry._id) return;
    setEditingEntryId(entry._id);
    setForm({
      heading: entry.heading,
      date: entry.date,
      coverImageUrl: entry.coverImageUrl,
      driveUrl: entry.driveUrl,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this achivement card?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/achivement/${id}`, { method: "DELETE" });
    if (!res.ok) return;

    if (editingEntryId === id) {
      handleReset();
    }

    fetchEntries();
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-6xl admin-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
          Achivement
        </p>
        <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
          Manage Achivement Cards
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
          Add a cover image link, heading/date, and album Drive link for each achivement card.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          {editingEntryId ? "Edit Achivement Card" : "Add Achivement Card"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="heading"
            value={form.heading}
            onChange={handleChange}
            placeholder="Heading (optional if date is provided)"
            className="w-full rounded-lg border px-4 py-2"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
          />

          <input
            type="text"
            name="coverImageUrl"
            value={form.coverImageUrl}
            onChange={handleChange}
            placeholder="Cover image link (Google Drive file link or image URL)"
            className="w-full rounded-lg border px-4 py-2"
            required
          />

          <input
            type="url"
            name="driveUrl"
            value={form.driveUrl}
            onChange={handleChange}
            placeholder="Google Drive folder link for all photos"
            className="w-full rounded-lg border px-4 py-2"
            required
          />

          {form.coverImageUrl && (
            <div className="overflow-hidden rounded-xl border">
              <SmartImage
                src={form.coverImageUrl}
                alt="Achivement cover preview"
                className="h-52 w-full object-cover"
              />
            </div>
          )}

          {form.driveUrl && (
            <a
              href={normalizeDriveUrl(form.driveUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 underline"
            >
              Preview Album Link
            </a>
          )}

          <p className="text-sm text-gray-500">
            Fill at least one field from heading/date.
          </p>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border px-6 py-2"
            >
              {editingEntryId ? "Cancel Edit" : "Reset"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
            >
              {loading
                ? editingEntryId
                  ? "Updating..."
                  : "Adding..."
                : editingEntryId
                  ? "Update Card"
                  : "Add Card"}
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">Achivement Cards</h2>

        {entries.length === 0 ? (
          <p className="mt-2 text-center text-gray-500">No achivement cards added yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry._id ?? `${entry.heading}-${index}`}
                className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  <div className="h-20 w-28 overflow-hidden rounded-lg border">
                    <SmartImage
                      src={entry.coverImageUrl}
                      alt={entry.heading || "Achivement card cover"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      {entry.heading || `Achivement ${index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {entry.date ? formatDate(entry.date) : "Date not provided"}
                    </p>
                    <a
                      href={entry.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Open Album
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(entry)}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => entry._id && handleDelete(entry._id)}
                    disabled={!entry._id}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
