import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import FacultyClient, { type Faculty as FacultyType } from "./FacultyClient";

export const dynamic = "force-dynamic";

const getFaculty = unstable_cache(
  async (): Promise<FacultyType[]> => {
    await connectDB();

    const docs = await Faculty.find()
      .sort({ createdAt: -1 })
      .select("name profession image email experience specialization about")
      .lean();

    return docs.map((doc) => ({
      _id: String(doc._id),
      name: doc.name,
      profession: doc.profession,
      image: doc.image,
      email: doc.email,
      experience: doc.experience,
      specialization: doc.specialization,
      about: doc.about,
    }));
  },
  ["faculty:list"],
  { revalidate: 60, tags: ["faculty:list"] }
);

export default async function FacultyPage() {
  const faculty = await getFaculty();
  return <FacultyClient initialFaculty={faculty} />;
}
