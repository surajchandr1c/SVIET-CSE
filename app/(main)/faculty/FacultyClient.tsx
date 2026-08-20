"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/shared/SmartImage";

export type Faculty = {
  _id: string;
  name: string;
  profession: string;
  image: string;
  email: string;
  experience: string;
  specialization: string;
  about: string;
  position?: number | null;
};

export default function FacultyClient({
  initialFaculty,
}: {
  initialFaculty: Faculty[];
}) {
  const [selected, setSelected] = useState<Faculty | null>(null);

  const facultyData = useMemo(() => {
    const data = [...(initialFaculty ?? [])];
    data.sort((a, b) => {
      const aPos = a.position ?? Number.POSITIVE_INFINITY;
      const bPos = b.position ?? Number.POSITIVE_INFINITY;
      if (aPos !== bPos) return aPos - bPos;
      return (a.name ?? "").localeCompare(b.name ?? "");
    });
    return data;
  }, [initialFaculty]);

  const accentBgs = [
    "bg-[#f3ede7]",
    "bg-[#f4c8d0]",
    "bg-[#7a93a5]",
    "bg-[#cfd7de]",
    "bg-[#d9efe8]",
    "bg-[#f6e7c8]",
  ];

  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="text-3xl font-bold text-center text-[#0b3c5d] mb-10">
        Our Faculty
      </h1>

      {facultyData.length === 0 ? (
        <p className="text-center text-gray-600">No faculty added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {facultyData.map((faculty, index) => {
            const imageSrc = normalizeImageUrl(faculty.image);
            const accentBg = accentBgs[index % accentBgs.length];

            return (
              <button
                key={faculty._id ?? `${faculty.email}-${index}`}
                onClick={() => setSelected(faculty)}
                type="button"
                className="group h-full text-left rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3c5d]/40"
                aria-label={`Open profile: ${faculty.name}`}
              >
                <div className={`relative h-60 ${accentBg}`}>
                  <div className="absolute inset-0 flex items-end justify-center px-6 pt-6 pb-2">
                    <SmartImage
                      src={imageSrc}
                      alt={faculty.name}
                      className="max-h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div
                    className="absolute -bottom-px left-0 right-0 h-12 bg-white"
                    style={{
                      clipPath:
                        "polygon(0 70%, 100% 0%, 100% 100%, 0% 100%)",
                    }}
                  />
                </div>

                <div className="px-5 pt-4 pb-5 text-center">
                  <h2 className="text-base font-semibold text-[#0b3c5d] leading-snug line-clamp-1">
                    {faculty.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {faculty.profession}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 px-2 sm:px-4 pb-2 sm:pb-4 pt-3 sm:pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative bg-white w-[98vw] h-[90vh] md:h-[84vh] max-w-screen-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <X size={22} />
              </button>

              <div className="md:w-1/2 w-full h-[38%] sm:h-[45%] md:h-full flex items-center justify-center bg-gray-100">
                <SmartImage
                  key={selected._id}
                  src={normalizeImageUrl(selected.image)}
                  alt={selected.name}
                  className="max-h-[80%] w-auto max-w-[85%] object-contain"
                />
              </div>

              <div className="md:w-1/2 w-full flex-1 p-5 sm:p-8 overflow-y-auto">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                  {selected.name}
                </h2>

                <p className="text-gray-600 mb-4">{selected.profession}</p>

                <p className="mb-4 text-gray-700">{selected.about}</p>

                <dl className="grid grid-cols-1 gap-3 text-base text-gray-700">
                  <div className="grid grid-cols-[140px_1fr] gap-1">
                    <dt className="font-semibold text-gray-800">Email :-</dt>
                    <dd>{selected.email}</dd>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-1">
                    <dt className="font-semibold text-gray-800">Experience :-</dt>
                    <dd>{selected.experience}</dd>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-1">
                    <dt className="font-semibold text-gray-800">
                      Specialization :-
                    </dt>
                    <dd>{selected.specialization}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
