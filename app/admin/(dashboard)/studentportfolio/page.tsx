import { Suspense } from "react";
import AdminStudentPortfolioClient from "./AdminStudentPortfolioClient";
import { AdminPageSkeleton } from "@/components/shared/Skeleton";

export const dynamic = "force-dynamic";

export default function AdminStudentPortfolioPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminStudentPortfolioClient />
    </Suspense>
  );
}
