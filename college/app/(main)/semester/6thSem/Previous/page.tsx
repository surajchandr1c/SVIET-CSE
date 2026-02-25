"use client";

import { useEffect, useState } from "react";

type Paper = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function SixthSemester() {
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/question-papers?semester=6th");
        const data = await res.json();
        setPapers(Array.isArray(data) ? data : []);
      } catch {
        setPapers([]);
      }
    };

    load();
  }, []);

  return (
    <section className="min-h-screen bg-transparent px-6 py-10 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
          6th Semester - B.Tech CSE
        </h1>

        <p className="text-gray-600 mb-8">Select a category below:</p>

        {papers.length === 0 ? (
          <p className="text-gray-500">No question papers available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {papers.map((paper, index) => (
              <a
                key={paper._id ?? `${paper.title}-${index}`}
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-10 text-center rounded-xl shadow-md hover:-translate-y-2 hover:shadow-lg transition duration-300"
              >
                <span className="text-blue-900 font-semibold text-lg block">
                  {paper.title}
                </span>
                <span className="text-sm text-gray-600 mt-1 block">{paper.code}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
