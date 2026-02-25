"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { normalizeImageUrl } from "@/lib/imageUrl";

type GalleryAlbum = {
  _id?: string;
  heading: string;
  date: string;
  coverImageUrl: string;
  driveUrl: string;
};

const initialForm: GalleryAlbum = {
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

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [form, setForm] = useState<GalleryAlbum>(initialForm);

  const fetchAlbums = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setAlbums(data);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setEditingAlbumId(null);
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
      const isEditMode = Boolean(editingAlbumId);
      const endpoint = isEditMode ? `/api/gallery/${editingAlbumId}` : "/api/gallery";

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

      if (!res.ok) throw new Error("Failed to save gallery album");

      alert(isEditMode ? "Gallery card updated." : "Gallery card added.");
      handleReset();
      fetchAlbums();
    } catch {
      alert(editingAlbumId ? "Error updating gallery card" : "Error adding gallery card");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (album: GalleryAlbum) => {
    if (!album._id) return;
    setEditingAlbumId(album._id);
    setForm({
      heading: album.heading,
      date: album.date,
      coverImageUrl: album.coverImageUrl,
      driveUrl: album.driveUrl,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this gallery card?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (!res.ok) return;

    if (editingAlbumId === id) {
      handleReset();
    }

    fetchAlbums();
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-6xl admin-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
          Gallery
        </p>
        <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
          Manage Gallery Cards
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
          Add a cover image link, heading/date, and album Drive link for each event card.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          {editingAlbumId ? "Edit Gallery Card" : "Add Gallery Card"}
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
                alt="Gallery cover preview"
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
              {editingAlbumId ? "Cancel Edit" : "Reset"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
            >
              {loading
                ? editingAlbumId
                  ? "Updating..."
                  : "Adding..."
                : editingAlbumId
                  ? "Update Card"
                  : "Add Card"}
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">Gallery Cards</h2>

        {albums.length === 0 ? (
          <p className="mt-2 text-center text-gray-500">No gallery cards added yet.</p>
        ) : (
          <div className="space-y-4">
            {albums.map((album, index) => (
              <div
                key={album._id ?? `${album.heading}-${index}`}
                className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  <div className="h-20 w-28 overflow-hidden rounded-lg border">
                    <SmartImage
                      src={album.coverImageUrl}
                      alt={album.heading || "Gallery card cover"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      {album.heading || `Gallery Album ${index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {album.date ? formatDate(album.date) : "Date not provided"}
                    </p>
                    <a
                      href={album.driveUrl}
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
                    onClick={() => handleEdit(album)}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => album._id && handleDelete(album._id)}
                    disabled={!album._id}
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
