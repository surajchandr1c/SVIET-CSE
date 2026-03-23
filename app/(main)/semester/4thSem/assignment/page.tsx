"use client";

import { useEffect, useState } from "react";
import { resolvePlaceholderHref } from "@/lib/resolvePlaceholderHref";
import ResourceCardLink from "@/components/ResourceCardLink";
import { ClipboardList } from "lucide-react";

type Resource = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

export default function FourthSemesterAssignmentPage() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/study-resources?semester=4th&category=assignment");
        const data = await res.json();
        setResources(Array.isArray(data) ? data : []);
      } catch {
        setResources([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col animate-fadeIn">
      <main className="flex-1">
        <section className="px-5 py-10">
          <h2 className="text-center text-2xl font-semibold text-slate-800 mb-10">
            4th Semester Assignment
          </h2>

          {resources.length === 0 ? (
            <p className="text-center text-gray-500">No assignments available.</p>
          ) : (
            <div className="mx-auto grid max-w-6xl auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {resources.map((resource, index) => (
                <ResourceCardLink
                  key={resource._id ?? `${resource.title}-${index}`}
                  href={resolvePlaceholderHref(resource.link)}
                  title={resource.title}
                  subtitle={resource.code}
                  Icon={ClipboardList}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
