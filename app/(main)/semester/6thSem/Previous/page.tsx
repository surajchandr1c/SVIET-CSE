"use client";

import { useEffect, useState } from "react";
import { resolvePlaceholderHref } from "@/lib/resolvePlaceholderHref";
import ResourceCardLink from "@/components/ResourceCardLink";
import { FileText } from "lucide-react";

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
          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {papers.map((paper, index) => (
              <ResourceCardLink
                key={paper._id ?? `${paper.title}-${index}`}
                href={resolvePlaceholderHref(paper.link)}
                title={paper.title}
                subtitle={paper.code}
                Icon={FileText}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
