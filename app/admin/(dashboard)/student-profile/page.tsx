import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function StudentProfileAdminPage() {
  redirect("/admin/student-list");
}
