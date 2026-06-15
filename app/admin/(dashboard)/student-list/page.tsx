import { Suspense } from "react";
import AdminStudentListTabs from "./AdminStudentListTabs";

export const dynamic = "force-dynamic";

export default function StudentListAdminPage() {
  return (
    <Suspense fallback={<div className="admin-card h-24" />}>
      <AdminStudentListTabs />
    </Suspense>
  );
}
