"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, MessageCircle, Linkedin, Github } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/shared/SmartImage";
import { compareTechxploreByOrderThenCreatedAtAsc } from "@/lib/techxploreOrder";

export type TechxploreStudent = {
  _id: string;
  name: string;
  position: string;
  order?: number | null;
  createdAt?: Date | string | null;
  image: string;
  admissionNo: string;
  batch: string;
  about: string;
  instagram?: string;
  whatsapp?: string;
  linkedin?: string;
  github?: string;
};

export default function TechxploreClient({
  initialStudents,
}: {
  initialStudents: TechxploreStudent[];
}) {
  const [selected, setSelected] = useState<TechxploreStudent | null>(null);
  const students = useMemo(() => {
    const data = [...(initialStudents ?? [])];
    data.sort(compareTechxploreByOrderThenCreatedAtAsc);
    return data;
  }, [initialStudents]);

  const accentBgs = [
    "bg-[#f3ede7]",
    "bg-[#f4c8d0]",
    "bg-[#7a93a5]",
    "bg-[#cfd7de]",
    "bg-[#d9efe8]",
    "bg-[#f6e7c8]",
  ];

  const normalizeSocialUrl = (
    kind: "instagram" | "whatsapp" | "linkedin" | "github",
    value?: string
  ) => {
    const raw = (value ?? "").trim();
    if (!raw) return null;

    if (/^https?:\/\//i.test(raw)) return raw;

    const withoutAt = raw.replace(/^@/, "");

    if (kind === "whatsapp") {
      const digits = raw.replace(/[^\d]/g, "");
      if (digits.length >= 8) return `https://wa.me/${digits}`;
      if (/^wa\.me\//i.test(raw)) return `https://${raw}`;
      return `https://${raw}`;
    }

    if (kind === "instagram") {
      if (raw.includes("/") || raw.includes(".")) return `https://${raw}`;
      return `https://instagram.com/${withoutAt}`;
    }

    if (kind === "linkedin") {
      if (raw.includes("/") || raw.includes(".")) return `https://${raw}`;
      return `https://linkedin.com/in/${withoutAt}`;
    }

    // github
    if (raw.includes("/") || raw.includes(".")) return `https://${raw}`;
    return `https://github.com/${withoutAt}`;
  };

  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="mb-10 text-center text-3xl font-bold text-[#0b3c5d]">
        TechXplore Team
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600">No students added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student, index) => {
            const imageSrc = normalizeImageUrl(student.image);
            const accentBg = accentBgs[index % accentBgs.length];

            return (
              <button
                key={student._id ?? `${student.admissionNo}-${index}`}
                onClick={() => setSelected(student)}
                type="button"
                className="group h-full text-left rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3c5d]/40"
                aria-label={`Open profile: ${student.name}`}
              >
                <div className={`relative h-60 ${accentBg}`}>
                  <div className="absolute inset-0 flex items-end justify-center px-6 pt-6 pb-2">
                    <SmartImage
                      src={imageSrc}
                      alt={student.name}
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
                    {student.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {student.position}
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

                <p className="text-gray-600 mb-4">{selected.position}</p>

                {selected.about ? (
                  <p className="mb-4 text-gray-700">{selected.about}</p>
                ) : null}

                <dl className="grid grid-cols-1 gap-3 text-base text-gray-700">
                  <div className="grid grid-cols-[140px_1fr] gap-1">
                    <dt className="font-semibold text-gray-800">
                      Admission No :-
                    </dt>
                    <dd>{selected.admissionNo}</dd>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-1">
                    <dt className="font-semibold text-gray-800">Batch :-</dt>
                    <dd>{selected.batch}</dd>
                  </div>
                </dl>

                {(() => {
                  const instagramUrl = normalizeSocialUrl(
                    "instagram",
                    selected.instagram
                  );
                  const whatsappUrl = normalizeSocialUrl(
                    "whatsapp",
                    selected.whatsapp
                  );
                  const linkedinUrl = normalizeSocialUrl(
                    "linkedin",
                    selected.linkedin
                  );
                  const githubUrl = normalizeSocialUrl("github", selected.github);

                  if (
                    !instagramUrl &&
                    !whatsappUrl &&
                    !linkedinUrl &&
                    !githubUrl
                  ) {
                    return null;
                  }

                  return (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {instagramUrl ? (
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-pink-300 bg-pink-50 px-3 py-1 text-black transition hover:bg-pink-100"
                        >
                          <Instagram size={16} />
                          Instagram
                        </a>
                      ) : null}
                      {whatsappUrl ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-black transition hover:bg-green-100"
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </a>
                      ) : null}
                      {linkedinUrl ? (
                        <a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-white bg-white px-3 py-1 text-black transition hover:bg-blue-100"
                        >
                          <Linkedin size={16} />
                          LinkedIn
                        </a>
                      ) : null}
                      {githubUrl ? (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200"
                        >
                          <Github size={16} />
                          GitHub
                        </a>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
