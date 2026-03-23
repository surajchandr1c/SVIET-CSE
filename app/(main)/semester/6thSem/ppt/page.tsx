"use client";

import { useEffect, useState } from "react";
import { resolvePlaceholderHref } from "@/lib/resolvePlaceholderHref";
import ResourceCardLink from "@/components/ResourceCardLink";
import { Presentation } from "lucide-react";

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
          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource, index) => (
              <ResourceCardLink
                key={resource._id ?? `${resource.title}-${index}`}
                href={resolvePlaceholderHref(resource.link)}
                title={resource.title}
                subtitle={resource.code}
                Icon={Presentation}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
