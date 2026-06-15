import { Suspense } from "react";
import AdminStudentPortfolioClient from "./AdminStudentPortfolioClient";

export const dynamic = "force-dynamic";

export default function AdminStudentPortfolioPage() {
  return (
    <Suspense fallback={<div className="admin-card h-24" />}>
      <AdminStudentPortfolioClient />
    </Suspense>
  );
}
