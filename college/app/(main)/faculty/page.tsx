"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/SmartImage";

type Faculty = {
  _id: string;
  name: string;
  profession: string;
  image: string;
  email: string;
  experience: string;
  specialization: string;
  about: string;
};

export default function FacultyPage() {
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [selected, setSelected] = useState<Faculty | null>(null);

  useEffect(() => {
    fetch("/api/faculty")
      .then((res) => res.json())
      .then((data) => setFacultyData(data));
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="text-3xl font-bold text-center text-[#0b3c5d] mb-10">
        Our Faculty
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {facultyData.map((faculty, index) => (
          <div
            key={faculty._id ?? `${faculty.email}-${index}`}
            onClick={() => setSelected(faculty)}
            className="cursor-pointer text-center group"
          >
            <SmartImage
              key={normalizeImageUrl(faculty.image)}
              src={normalizeImageUrl(faculty.image)}
              alt={faculty.name}
              className="w-40 h-40 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
            />
            <h2 className="mt-3 font-semibold text-[#0b3c5d]">
              {faculty.name}
            </h2>
            <p className="text-sm text-gray-600">
              {faculty.profession}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative bg-white w-full h-full md:w-[85%] md:h-[85%] rounded-none md:rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <X size={22} />
              </button>

              <div className="md:w-1/2 w-full h-1/2 md:h-full flex items-center justify-center bg-gray-100">
                <SmartImage
                  key={normalizeImageUrl(selected.image)}
                  src={normalizeImageUrl(selected.image)}
                  alt={selected.name}
                  className="h-80 md:h-[90%] object-contain"
                />
              </div>

              <div className="md:w-1/2 w-full h-1/2 md:h-full p-8 overflow-y-auto">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                  {selected.name}
                </h2>

                <p className="text-gray-600 mb-4">
                  {selected.profession}
                </p>

                <p className="mb-4 text-gray-700">
                  {selected.about}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Email:</strong> {selected.email}</p>
                  <p><strong>Experience:</strong> {selected.experience}</p>
                  <p><strong>Specialization:</strong> {selected.specialization}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
