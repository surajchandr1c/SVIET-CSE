"use client";

import { useEffect, useState } from "react";

type Notice = {
  _id: string;
  heading: string;
  date: string;
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

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data));
  }, []);

  return (
    <div className="mx-auto mt-10 max-w-[1180px] rounded-3xl border border-cyan-400/20 bg-[#0b1c47]/75 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      <h2 className="mb-6 text-center text-3xl font-semibold tracking-widest text-slate-200 md:text-4xl">
        NOTICE BOARD
      </h2>

      {notices.length === 0 ? (
        <p className="py-4 text-center text-slate-400">No notices available.</p>
      ) : (
        <ul>
          {notices.map((notice) => (
            <li key={notice._id} className="border-b border-cyan-300/15 last:border-b-0">
              <a
                href={notice.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 px-3 py-4 transition hover:bg-cyan-300/5"
              >
                <span className="min-w-[125px] text-sm font-semibold text-cyan-300 md:text-lg">
                  {formatDate(notice.date)}
                </span>

                <span className="text-sm text-slate-200 md:text-lg">{notice.heading}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
