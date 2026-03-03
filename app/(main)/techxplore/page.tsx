"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, MessageCircle, Linkedin, Github } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/SmartImage";

type TechxploreStudent = {
  _id: string;
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
  about: string;
  instagram?: string;
  whatsapp?: string;
  linkedin?: string;
  github?: string;
};

export default function TechxplorePage() {
  const [students, setStudents] = useState<TechxploreStudent[]>([]);
  const [selected, setSelected] = useState<TechxploreStudent | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/techxplore");
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch {
        setStudents([]);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="mb-10 text-center text-3xl font-bold text-[#0b3c5d]">
        TechXplore Team
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600">No students added yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {students.map((student, index) => (
            <div
              key={student._id ?? `${student.admissionNo}-${index}`}
              onClick={() => setSelected(student)}
              className="group cursor-pointer text-center"
            >
              <SmartImage
                key={normalizeImageUrl(student.image)}
                src={normalizeImageUrl(student.image)}
                alt={student.name}
                className="mx-auto h-40 w-40 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <h2 className="mt-3 font-semibold text-[#0b3c5d]">{student.name}</h2>
              <p className="text-sm text-gray-600">{student.position}</p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-xl md:h-[85%] md:w-[85%] md:flex-row md:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
              >
                <X size={22} />
              </button>

              <div className="flex h-1/2 w-full items-center justify-center bg-gray-100 md:h-full md:w-1/2">
                <SmartImage
                  key={normalizeImageUrl(selected.image)}
                  src={normalizeImageUrl(selected.image)}
                  alt={selected.name}
                  className="h-80 object-contain md:h-[90%]"
                />
              </div>

              <div className="h-1/2 w-full overflow-y-auto p-8 md:h-full md:w-1/2">
                <h2 className="mb-2 text-2xl font-bold text-blue-700">{selected.name}</h2>
                <p className="mb-4 text-gray-600">{selected.position}</p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Admission No:</strong> {selected.admissionNo}
                  </p>
                  <p>
                    <strong>Batch:</strong> {selected.batch}
                  </p>
                  <div className="pt-2">
                    <p className="mb-1">
                      <strong>About:</strong>
                    </p>
                    <p className="leading-6 text-gray-600">
                      {selected.about || "No details available."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">
                    {selected.instagram && (
                      <a
                        href={selected.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-pink-300 bg-pink-50 px-3 py-1 text-pink-700 transition hover:bg-pink-100"
                      >
                        <Instagram size={16} />
                        Instagram
                      </a>
                    )}
                    {selected.whatsapp && (
                      <a
                        href={selected.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-green-700 transition hover:bg-green-100"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </a>
                    )}
                    {selected.linkedin && (
                      <a
                        href={selected.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-blue-700 transition hover:bg-blue-100"
                      >
                        <Linkedin size={16} />
                        LinkedIn
                      </a>
                    )}
                    {selected.github && (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200"
                      >
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
