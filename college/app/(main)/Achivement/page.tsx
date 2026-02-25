"use client";

import { useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";

type AchivementEntry = {
  _id: string;
  heading: string;
  date: string;
  coverImageUrl: string;
  driveUrl: string;
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

export default function AchivementPage() {
  const [entries, setEntries] = useState<AchivementEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/achivement")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen px-6 pb-10 pt-8">
      <h1 className="mb-10 text-center text-3xl font-bold text-slate-200 md:text-5xl lg:text-4xl">
        Achivement
      </h1>

      {loading ? (
        <p className="text-center text-slate-300">Loading achivement cards...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-slate-300">No achivement cards available right now.</p>
      ) : (
        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, index) => (
            <a
              key={entry._id}
              href={entry.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#0b1c47]/75 shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1"
            >
              <div className="h-[230px] overflow-hidden">
                <SmartImage
                  src={entry.coverImageUrl}
                  alt={entry.heading || `Achivement ${index + 1}`}
                  className="h-full w-full object-cover transition duration-500 hover:scale-110"
                />
              </div>

              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-slate-200 md:text-2xl">
                  {entry.heading || `Achivement ${index + 1}`}
                </h2>
                <p className="mt-1 text-lg font-semibold text-slate-300 md:text-xl">
                  {entry.date ? formatDate(entry.date) : "Open Album"}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
