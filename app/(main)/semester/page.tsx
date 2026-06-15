"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import SemesterTabsClient, { type SemesterKey } from "./SemesterTabsClient";
import { getSemesterNavigationItems } from "@/config/semesterNavigation";

export default function SemestersPage() {
  const [semester, setSemester] = useState<SemesterKey>("4th");

  const items = useMemo(
    () => getSemesterNavigationItems(semester),
    [semester]
  );

  return (
    <div className="min-h-screen animate-fadeIn px-6 pb-10 pt-8">
      <main className="mx-auto max-w-[1680px]">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl lg:text-[2.2rem]">
          B.Tech CSE - Semesters
        </h1>

        <p className="mt-3 text-lg text-slate-600 md:text-xl lg:text-lg">
          Select your semester:
        </p>

        <SemesterTabsClient value={semester} onChange={setSemester} />

        <AnimatePresence mode="wait">
          <motion.div
            key={semester}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mt-2 text-center">
              <p className="mt-2 text-slate-600">Select a category below:</p>
            </div>

            <div className="mt-7 grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <Link
                  key={`${semester}-${item.name}`}
                  href={item.link}
                  className="group relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-[0_10px_24px_rgba(17,24,39,0.10)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.25)]"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-extrabold text-slate-900 md:text-[1.35rem]">
                        {item.name}
                      </h3>
                      <p className="mt-3 text-sm font-semibold tracking-wide text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/15 transition group-hover:bg-blue-600/15">
                      <item.Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
