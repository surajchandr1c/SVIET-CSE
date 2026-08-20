"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, Link2 } from "lucide-react";
import ResourceCardLink from "@/components/main/ResourceCardLink";
import { apiRoutes } from "@/lib/apiRoutes";
import { ResourceGridSkeleton } from "@/components/shared/Skeleton";

type BaseItem = {
  _id?: string;
  title: string;
  code: string;
  link: string;
};

const pageMeta = {
  syllabus: {
    title: "Syllabus",
    empty: "No syllabus items available.",
    load: (semester: "3rd" | "4th" | "5th" | "6th") => apiRoutes.syllabus(semester),
    icon: BookOpen,
  },
  previous: {
    title: "Previous 5-Year Question Papers",
    empty: "No question papers available.",
    load: (semester: "3rd" | "4th" | "5th" | "6th") => apiRoutes.questionPapers(semester),
    icon: FileText,
  },
  assignment: {
    title: "Assignments",
    empty: "No assignments available.",
    load: (semester: "3rd" | "4th" | "5th" | "6th") =>
      apiRoutes.studyResources(semester, "assignment"),
    icon: Link2,
  },
  notes: {
    title: "Notes",
    empty: "No notes available.",
    load: (semester: "3rd" | "4th" | "5th" | "6th") => apiRoutes.studyResources(semester, "notes"),
    icon: Link2,
  },
  ppt: {
    title: "PPT",
    empty: "No presentation links available.",
    load: (semester: "3rd" | "4th" | "5th" | "6th") => apiRoutes.studyResources(semester, "ppt"),
    icon: Link2,
  },
} as const;

type ResourcePageKind = keyof typeof pageMeta;

export default function SemesterResourceList({
  semester,
  kind,
}: {
  semester: "3rd" | "4th" | "5th" | "6th";
  kind: ResourcePageKind;
}) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(pageMeta[kind].load(semester), {
          cache: "no-store",
        });
        const data = (await res.json()) as BaseItem[];
        if (active) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) {
          setItems([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [kind, semester]);

  const meta = pageMeta[kind];

  return (
    <section className="min-h-screen px-6 pb-10 pt-8">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
          {semester} Semester {meta.title}
        </h1>
        <p className="mt-3 text-center text-base text-slate-600 md:text-lg">
          Open available resources for this semester.
        </p>

        {loading ? (
          <div className="mt-8"><ResourceGridSkeleton /></div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-lg">
            {meta.empty}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <ResourceCardLink
                key={item._id ?? `${item.title}-${index}`}
                href={item.link}
                title={item.title}
                subtitle={item.code}
                Icon={meta.icon}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
