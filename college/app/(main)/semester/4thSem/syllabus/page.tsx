"use client";

import { useEffect, useState } from "react";

type Subject = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function FourthSemesterSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/syllabus?semester=4th");
        const data = await res.json();
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        setSubjects([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col animate-fadeIn">
      <main className="flex-1">
        <section className="px-5 py-10">
          <h2 className="text-center text-2xl font-semibold text-slate-800 mb-10">
            4th Semester Subjects
          </h2>

          {subjects.length === 0 ? (
            <p className="text-center text-gray-500">No syllabus available.</p>
          ) : (
            <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject, index) => (
                <a
                  key={subject._id ?? `${subject.title}-${index}`}
                  href={subject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div
                    className="bg-white rounded-xl p-6 border-l-4 border-blue-600 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-center"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {subject.title}
                    </h3>

                    <p className="text-sm font-semibold text-slate-600 mb-1">
                      {subject.code}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
