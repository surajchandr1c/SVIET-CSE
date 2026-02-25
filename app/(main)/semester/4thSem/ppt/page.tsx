"use client";

import { useEffect, useState } from "react";

type Resource = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function FourthSemesterPptPage() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/study-resources?semester=4th&category=ppt");
        const data = await res.json();
        setResources(Array.isArray(data) ? data : []);
      } catch {
        setResources([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent py-16 px-6">
      <h1 className="px-5 pt-5 text-2xl font-bold text-gray-800">4th Semester PPT</h1>

      {resources.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">No PPT available.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-5 mt-6">
          {resources.map((resource, index) => (
            <a
              href={resource.link}
              key={resource._id ?? `${resource.title}-${index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 rounded-2xl shadow-lg p-8 border-l-4 border-blue-600 hover:scale-105 transition duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{resource.title}</h2>
              <p className="text-gray-600 mb-2">{resource.code}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
