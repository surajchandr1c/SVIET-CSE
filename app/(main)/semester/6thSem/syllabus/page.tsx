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
          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
