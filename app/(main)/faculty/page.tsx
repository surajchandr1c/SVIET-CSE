import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { unstable_cache } from "next/cache";
import { compareFacultyByPositionThenCreatedAtDesc } from "@/lib/facultyOrder";
import FacultyClient, { type Faculty as FacultyType } from "./FacultyClient";

export const dynamic = "force-dynamic";

const getCachedFaculty = unstable_cache(
  async () => {
    await connectDB();
    return Faculty.find()
      .select("name profession image email experience specialization about position createdAt")
      .lean();
  },
  ["faculty-page"],
  { revalidate: 60, tags: ["faculty:list"] }
);

export default async function FacultyPage() {
  const docs = await getCachedFaculty();

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
