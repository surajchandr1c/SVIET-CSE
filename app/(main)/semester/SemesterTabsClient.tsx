"use client";

import { useMemo } from "react";

export type SemesterKey = "4th" | "6th";

const tabs: { key: SemesterKey; label: string }[] = [
  { key: "4th", label: "4th Sem" },
  { key: "6th", label: "6th Sem" },
];

export default function SemesterTabsClient({
  value,
  onChange,
}: {
  value: SemesterKey;
  onChange: (next: SemesterKey) => void;
}) {
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((t) => t.key === value)),
    [value]
  );

  return (
    <div className="mt-6 mb-6 flex justify-center">
      <div
        role="tablist"
        aria-label="Semester selection"
        className="relative w-full max-w-lg overflow-hidden rounded-full bg-slate-950/90 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.25)] ring-1 ring-black/10"
      >
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab) => {
            const isActive = tab.key === value;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.key)}
                className={[
                  "relative z-10 rounded-full px-3 py-2.5 text-base font-semibold transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-200/80 hover:text-white",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          aria-hidden
          className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.25rem)/2)] rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)] transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      </div>
    </div>
  );
}

