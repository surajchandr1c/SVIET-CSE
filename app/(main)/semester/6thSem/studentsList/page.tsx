import { redirect } from "next/navigation";

export default function SixthSemesterStudentsListPage() {
  redirect("/student-list?tab=2023");
}
