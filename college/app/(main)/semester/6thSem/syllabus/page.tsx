"use client";

import { useEffect, useState } from "react";

type Subject = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function SixthSemester() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/syllabus?semester=6th");
        const data = await res.json();
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        setSubjects([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <section className="px-6 py-12 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          6th Semester Subjects
        </h2>

        {subjects.length === 0 ? (
          <p className="text-center text-gray-500">No syllabus available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, index) => (
              <a
                key={subject._id ?? `${subject.title}-${index}`}
                href={subject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border-l-4 border-blue-600">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {subject.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {subject.code}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
