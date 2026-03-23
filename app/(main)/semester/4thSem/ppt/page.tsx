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
        <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}
