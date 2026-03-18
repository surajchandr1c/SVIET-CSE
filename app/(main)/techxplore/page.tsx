import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import TechxploreStudent from "@/models/TechxploreStudent";
import TechxploreClient, {
  type TechxploreStudent as TechxploreStudentType,
} from "./TechxploreClient";

export const dynamic = "force-dynamic";

const getStudents = unstable_cache(
  async (): Promise<TechxploreStudentType[]> => {
    await connectDB();

    const docs = await TechxploreStudent.find()
      .sort({ createdAt: -1 })
      .select(
        "name position image admissionNo batch about instagram whatsapp linkedin github"
      )
      .lean();

    return docs.map((doc) => ({
      _id: String(doc._id),
      name: doc.name,
      position: doc.position,
      image: doc.image,
      admissionNo: doc.admissionNo,
      batch: doc.batch,
      about: doc.about,
      instagram: doc.instagram || undefined,
      whatsapp: doc.whatsapp || undefined,
      linkedin: doc.linkedin || undefined,
      github: doc.github || undefined,
    }));
  },
  ["techxplore:list"],
  { revalidate: 60, tags: ["techxplore:list"] }
);

export default async function TechxplorePage() {
  const students = await getStudents();
  return <TechxploreClient initialStudents={students} />;
}
