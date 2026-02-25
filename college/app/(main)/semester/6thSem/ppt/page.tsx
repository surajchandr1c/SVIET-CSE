"use client";

import { useEffect, useState } from "react";

type Resource = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function SixthSemesterPptPage() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/study-resources?semester=6th&category=ppt");
        const data = await res.json();
        setResources(Array.isArray(data) ? data : []);
      } catch {
        setResources([]);
      }
    };

    load();
  }, []);

  return (
    <section className="min-h-screen bg-transparent px-6 py-10 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
          6th Semester PPT
        </h1>
        <p className="text-gray-600 mb-8">Select a subject below:</p>

        {resources.length === 0 ? (
          <p className="text-gray-500">No PPT available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {resources.map((resource, index) => (
              <a
                key={resource._id ?? `${resource.title}-${index}`}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-10 text-center rounded-xl shadow-md hover:-translate-y-2 hover:shadow-lg transition duration-300"
              >
                <span className="text-blue-900 font-semibold text-lg block">
                  {resource.title}
                </span>
                <span className="text-sm text-gray-600 mt-1 block">
                  {resource.code}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
