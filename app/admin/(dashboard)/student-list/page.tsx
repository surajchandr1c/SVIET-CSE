import { Suspense } from "react";
import AdminStudentListTabs from "./AdminStudentListTabs";
import { AdminPageSkeleton } from "@/components/shared/Skeleton";

export const dynamic = "force-dynamic";

export default function StudentListAdminPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminStudentListTabs />
    </Suspense>
  );
}
