import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { compareFacultyByPositionThenCreatedAtDesc } from "@/lib/facultyOrder";
import FacultyClient, { type Faculty as FacultyType } from "./FacultyClient";

export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  await connectDB();

  const docs = await Faculty.find()
    .select(
      "name profession image email experience specialization about position createdAt"
    )
    .lean();

  docs.sort(compareFacultyByPositionThenCreatedAtDesc);

  const faculty: FacultyType[] = docs.map((doc) => ({
    _id: String(doc._id),
    name: doc.name,
    profession: doc.profession,
    image: doc.image,
    email: doc.email,
    experience: doc.experience,
    specialization: doc.specialization,
    about: doc.about,
    position: doc.position ?? null,
  }));

  return <FacultyClient initialFaculty={faculty} />;
}
