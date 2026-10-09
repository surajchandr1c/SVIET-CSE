import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listStudentsForSemester } from "@/lib/students";
import StudentListTabs from "./StudentListTabs";
import { PublicStudentTableSkeleton } from "@/components/shared/Skeleton";
import { verifyStudentToken } from "@/lib/studentAuth";
import { verifyAdminToken } from "@/lib/auth";

type Student = {
  _id?: string;
  admissionNo: string;
  name: string;
};

export const dynamic = "force-dynamic";

export default async function StudentListPage() {
  const cookieStore = await cookies();
  const studentToken = cookieStore.get("student_token")?.value;
  const adminToken = cookieStore.get("admin_token")?.value;

  const isStudent = Boolean(studentToken && verifyStudentToken(studentToken));
  const isAdmin = Boolean(adminToken && verifyAdminToken(adminToken));

  if (!isStudent && !isAdmin) {
    redirect("/login?redirect=/student-list");
  }

  const [students2023, students2024] = (await Promise.all([
    listStudentsForSemester(6),
    listStudentsForSemester(4),
  ])) as [Student[], Student[]];

  return (
    <Suspense fallback={<PublicStudentTableSkeleton />}>
      <StudentListTabs students2023={students2023} students2024={students2024} />
    </Suspense>
  );
}
