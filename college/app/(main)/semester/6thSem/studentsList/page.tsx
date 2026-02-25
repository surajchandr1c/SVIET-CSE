"use client";

import { useEffect, useState } from "react";

type Student = {
  _id?: string;
  admissionNo: string;
  name: string;
};

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/students?semester=6th");
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
      <h1 className="text-3xl font-bold text-center mb-6">
        Student List - 6th Semester
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-sky-900 text-white">
            <tr>
              <th className="py-2 px-4 border">Sr. No.</th>
              <th className="py-2 px-4 border">Admission No.</th>
              <th className="py-2 px-4 border">Name</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id ?? `${student.admissionNo}-${index}`}
                className="text-center hover:bg-gray-100"
              >
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{student.admissionNo}</td>
                <td className="py-2 px-4 border">{student.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
