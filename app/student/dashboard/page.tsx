import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyStudentToken } from "@/lib/studentAuth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import BatchProfile from "@/models/BatchProfile";
import StudentDashboardClient from "./StudentDashboardClient";

type SkillGroup = {
  title: string;
  items: string[];
};

const normalizeSkills = (value: unknown): SkillGroup[] => {
  if (!Array.isArray(value)) return [];

  const groups = value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      title: typeof item.title === "string" ? item.title.trim() : "",
      items: Array.isArray(item.items)
        ? item.items
            .filter((entry): entry is string => typeof entry === "string")
            .map((entry) => entry.trim())
            .filter(Boolean)
        : [],
    }))
    .filter((item) => item.title && item.items.length > 0);

  if (groups.length > 0) return groups;

  const flat = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return flat.length > 0 ? [{ title: "Skills", items: flat }] : [];
};

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const token = (await cookies()).get("student_token")?.value;
  const payload = token ? verifyStudentToken(token) : null;
  if (!payload) redirect("/login");

  await connectDB();
  const candidates = await Student.find({ admissionNo: payload.admissionNo })
    .select("name admissionNo semester mustChangePassword")
    .select("+password")
    .sort({ updatedAt: -1, createdAt: -1, _id: -1 })
    .limit(5)
    .lean<
      Array<{
        name: string;
        admissionNo: string;
        semester: number;
        mustChangePassword?: boolean;
        password?: string;
      }>
    >();

  const student =
    candidates.find((c) => typeof c.password === "string" && c.password.length > 0) ??
    candidates[0] ??
    null;

  if (!student) redirect("/login");
  if (student.mustChangePassword) redirect("/student/change-password");

  const profile = await BatchProfile.findOne({ admissionNo: student.admissionNo })
    .select("name position image admissionNo batch course about keywords instagram email whatsapp linkedin github skills projects certificates achievements")
    .lean<Record<string, unknown> | null>();

  const batch = student.semester === 6 ? "2023 Batch" : "2024 Batch";

  return (
    <StudentDashboardClient
      initialProfile={{
        name: typeof profile?.name === "string" ? profile.name : student.name,
        position: typeof profile?.position === "string" ? profile.position : "Student",
        image: typeof profile?.image === "string" && profile.image ? profile.image : "/no-image.png",
        admissionNo: student.admissionNo,
        batch: typeof profile?.batch === "string" && profile.batch ? profile.batch : batch,
        course: typeof profile?.course === "string" && profile.course ? profile.course : "B.Tech CSE",
        about: typeof profile?.about === "string" ? profile.about : "",
        keywords: typeof profile?.keywords === "string" ? profile.keywords : "",
        instagram: typeof profile?.instagram === "string" ? profile.instagram : "",
        email:
          typeof profile?.email === "string"
            ? profile.email
            : typeof profile?.whatsapp === "string"
              ? profile.whatsapp
              : "",
        linkedin: typeof profile?.linkedin === "string" ? profile.linkedin : "",
        github: typeof profile?.github === "string" ? profile.github : "",
        skills: normalizeSkills(profile?.skills),
        projects: Array.isArray(profile?.projects)
          ? profile.projects
              .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
              .map((item) => ({
                title: typeof item.title === "string" ? item.title : "",
                description: typeof item.description === "string" ? item.description : "",
                link: typeof item.link === "string" ? item.link : "",
              }))
          : [],
        certificates: Array.isArray(profile?.certificates)
          ? profile.certificates
              .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
              .map((item) => ({
                title: typeof item.title === "string" ? item.title : "",
                date: typeof item.date === "string" ? item.date : "",
                previewImage: typeof item.previewImage === "string" ? item.previewImage : "",
                link: typeof item.link === "string" ? item.link : "",
              }))
          : [],
        achievements: Array.isArray(profile?.achievements)
          ? profile.achievements
              .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
              .map((item) => ({
                title: typeof item.title === "string" ? item.title : "",
                description: typeof item.description === "string" ? item.description : "",
                previewImage: typeof item.previewImage === "string" ? item.previewImage : "",
                link: typeof item.link === "string" ? item.link : "",
                date: typeof item.date === "string" ? item.date : "",
              }))
          : [],
      }}
    />
  );
}
