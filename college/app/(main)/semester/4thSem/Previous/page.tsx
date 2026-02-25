"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Paper = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function FourthSemesterPage() {
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/question-papers?semester=4th");
        const data = await res.json();
        setPapers(Array.isArray(data) ? data : []);
      } catch {
        setPapers([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent px-5 py-10">
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-center text-2xl font-semibold text-slate-800 mb-10">
          4th Semester - B.Tech CSE
        </h2>
        <p className="text-gray-600 text-lg">Select a subject below:</p>
      </div>

      {papers.length === 0 ? (
        <p className="text-center text-gray-600">No question papers available.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-5 mt-6">
          {papers.map((paper, index) => (
            <Link
              key={paper._id ?? `${paper.title}-${index}`}
              href={paper.link}
              target="_blank"
              className="bg-gray-100 rounded-2xl shadow-lg p-8 border-l-4 border-blue-600 hover:scale-105 transition duration-300 block"
            >
              <h3 className="text-lg font-semibold text-slate-700 mb-1">
                {paper.title}
              </h3>
              <p className="text-gray-600">{paper.code}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
