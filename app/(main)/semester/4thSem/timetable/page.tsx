"use client";

import timetable from "@/data/timetable.json";


type Subject = {
  code: string;
  name: string;
  faculty: string;
  group: string;
  time: string;
  hall: string;
};

type DaySchedule = {
  day: string;
  subjects: Subject[];
};

export default function TimetablePage() {
  const data = timetable as DaySchedule[];

  return (
    <div className="min-h-screen bg-transparent p-6">
      <h1 className="text-3xl font-bold text-center text-[#0b3c5d] mb-8">
        CSE-D Time Table
      </h1>

      {data.map((daySchedule) => (
        <div key={daySchedule.day} className="mb-10">
          <h2 className="text-xl text-center font-semibold text-[#0b3c5d] mb-4">
            {daySchedule.day}
          </h2>
          <div className="w-full overflow-x-auto flex justify-center items-center scrollbar-hide">
          <table className="min-w-[900px] whitespace-nowrap text-sm text-left bg-white rounded-xl shadow-lg">
          <thead className="bg-blue-600 text-white">
      <tr>
        <th className="px-4 py-3">Code</th>
        <th className="px-4 py-3">Subject</th>
        <th className="px-4 py-3">Faculty</th>
        <th className="px-4 py-3">Group</th>
        <th className="px-4 py-3">Time</th>
        <th className="px-4 py-3">Hall</th>
      </tr>
    </thead>

    <tbody>
      {daySchedule.subjects.map((subject, index) => (
        <tr key={index} className="border-b hover:bg-gray-50">
          <td className="px-4 py-3 font-medium text-[#0b3c5d]  whitespace-nowrap">{subject.code}</td>
          <td className="px-4 py-3 whitespace-nowrap">{subject.name}</td>
          <td className="px-4 py-3 whitespace-nowrap">{subject.faculty}</td>
          <td className="px-4 py-3 whitespace-nowrap">{subject.group}</td>
          <td className="px-4 py-3 whitespace-nowrap">{subject.time}</td>
          <td className="px-4 py-3 whitespace-nowrap">{subject.hall}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>
      ))}
    </div>
  );
}
