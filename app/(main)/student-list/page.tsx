import { Suspense } from "react";
import { listStudentsForSemester } from "@/lib/students";
import StudentListTabs from "./StudentListTabs";

type Student = {
  _id?: string;
  admissionNo: string;
  name: string;
};

export const dynamic = "force-dynamic";

export default async function StudentListPage() {
  const [students2023, students2024] = (await Promise.all([
    listStudentsForSemester(6),
    listStudentsForSemester(4),
  ])) as [Student[], Student[]];

  return (
    <Suspense fallback={<div className="min-h-screen px-6 pb-10 pt-8" />}>
      <StudentListTabs students2023={students2023} students2024={students2024} />
    </Suspense>
  );
}
