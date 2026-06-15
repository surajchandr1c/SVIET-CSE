import { redirect } from "next/navigation";

export default function FourthSemesterStudentsListPage() {
  redirect("/student-list?tab=2024");
}
