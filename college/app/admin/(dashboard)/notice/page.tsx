"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Notice = {
  _id?: string;
  heading: string;
  date: string;
  driveUrl: string;
};

const extractGoogleDriveFileId = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const directMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (directMatch?.[1]) return directMatch[1];

  try {
    const parsed = new URL(trimmed);
    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
    return null;
  }

  return null;
};

const normalizeNoticeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const id = extractGoogleDriveFileId(trimmed);
  if (!id) return trimmed;
  return `https://drive.google.com/file/d/${id}/view`;
};

const initialForm: Notice = {
  heading: "",
  date: "",
  driveUrl: "",
};

export default function AdminNoticePage() {
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [form, setForm] = useState<Notice>(initialForm);

  const fetchNotices = async () => {
    const res = await fetch("/api/notices");
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "driveUrl") {
      setForm({ ...form, driveUrl: value });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setEditingNoticeId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditMode = Boolean(editingNoticeId);
      const endpoint = isEditMode
        ? `/api/notices/${editingNoticeId}`
        : "/api/notices";

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          driveUrl: normalizeNoticeUrl(form.driveUrl),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert(isEditMode ? "Notice updated successfully!" : "Notice added successfully!");
      handleReset();
      fetchNotices();
    } catch {
      alert(editingNoticeId ? "Error updating notice" : "Error adding notice");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice: Notice) => {
    if (!notice._id) return;
    setEditingNoticeId(notice._id);
    setForm({
      heading: notice.heading,
      date: notice.date,
      driveUrl: notice.driveUrl,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this notice?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/notices/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return;

    if (editingNoticeId === id) {
      handleReset();
    }

    fetchNotices();
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto w-full max-w-6xl admin-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
          Notice Board
        </p>
        <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
          Manage Notice Board
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
          Publish and edit notices for all students quickly.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          {editingNoticeId ? "Edit Notice" : "Add Notice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="heading"
            value={form.heading}
            onChange={handleChange}
            placeholder="Notice Heading"
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="text"
            name="driveUrl"
            value={form.driveUrl}
            onChange={handleChange}
            placeholder="Paste Google Drive file link"
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          {form.driveUrl && (
            <a
              href={normalizeNoticeUrl(form.driveUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 underline"
            >
              Preview Notice Link
            </a>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border rounded-lg"
            >
              {editingNoticeId ? "Cancel Edit" : "Reset"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading
                ? editingNoticeId
                  ? "Updating..."
                  : "Adding..."
                : editingNoticeId
                  ? "Update Notice"
                  : "Add Notice"}
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Notice List</h2>

        <div className="space-y-4">
          {notices.map((notice, index) => (
            <div
              key={notice._id ?? `${notice.heading}-${index}`}
              className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-lg">{notice.heading}</h3>
                <p className="text-sm text-gray-500">{notice.date}</p>
                <a
                  href={notice.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Open Notice
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(notice)}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => notice._id && handleDelete(notice._id)}
                  disabled={!notice._id}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {notices.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No notice uploaded yet.</p>
        )}
      </div>
    </section>
  );
}
