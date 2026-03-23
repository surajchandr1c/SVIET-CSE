"use client";

import { useEffect, useState } from "react";
import { resolvePlaceholderHref } from "@/lib/resolvePlaceholderHref";
import ResourceCardLink from "@/components/ResourceCardLink";
import { BookOpen } from "lucide-react";

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
            <div className="mx-auto grid max-w-6xl auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject, index) => (
                <ResourceCardLink
                  key={subject._id ?? `${subject.title}-${index}`}
                  href={resolvePlaceholderHref(subject.link)}
                  title={subject.title}
                  subtitle={subject.code}
                  Icon={BookOpen}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
