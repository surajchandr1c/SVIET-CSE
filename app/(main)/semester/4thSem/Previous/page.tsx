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
        <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}
