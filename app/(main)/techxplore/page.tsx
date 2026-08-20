import { connectDB } from "@/lib/mongodb";
import TechxploreStudent from "@/models/TechxploreStudent";
import { unstable_cache } from "next/cache";
import { compareTechxploreByOrderThenCreatedAtAsc } from "@/lib/techxploreOrder";
import TechxploreClient, {
  type TechxploreStudent as TechxploreStudentType,
} from "./TechxploreClient";

export const dynamic = "force-dynamic";

const getCachedTechxploreStudents = unstable_cache(
  async () => {
    await connectDB();
    return TechxploreStudent.find()
      .select("name position order image admissionNo batch about instagram whatsapp linkedin github createdAt")
      .lean<Array<TechxploreStudentType & { _id: unknown }>>();
  },
  ["techxplore-page"],
  { revalidate: 60, tags: ["techxplore:list"] }
);

export default async function TechxplorePage() {
  const docs = await getCachedTechxploreStudents();

  docs.sort(compareTechxploreByOrderThenCreatedAtAsc);

  const students: TechxploreStudentType[] = docs.map((doc) => ({
    _id: String(doc._id),
    name: doc.name,
    position: doc.position,
    order: doc.order ?? null,
    image: doc.image,
    admissionNo: doc.admissionNo,
    batch: doc.batch,
    about: doc.about,
    instagram: doc.instagram || undefined,
    whatsapp: doc.whatsapp || undefined,
    linkedin: doc.linkedin || undefined,
    github: doc.github || undefined,
    createdAt: doc.createdAt ?? null,
  }));

  return <TechxploreClient initialStudents={students} />;
}
