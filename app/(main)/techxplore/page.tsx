import { connectDB } from "@/lib/mongodb";
import TechxploreStudent from "@/models/TechxploreStudent";
import { compareTechxploreByOrderThenCreatedAtAsc } from "@/lib/techxploreOrder";
import TechxploreClient, {
  type TechxploreStudent as TechxploreStudentType,
} from "./TechxploreClient";

export const dynamic = "force-dynamic";

export default async function TechxplorePage() {
  await connectDB();

  const docs = await TechxploreStudent.find()
    .select(
      "name position order image admissionNo batch about instagram whatsapp linkedin github createdAt"
    )
    .lean();

  docs.sort(compareTechxploreByOrderThenCreatedAtAsc as any);

  const students: TechxploreStudentType[] = docs.map((doc: any) => ({
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
