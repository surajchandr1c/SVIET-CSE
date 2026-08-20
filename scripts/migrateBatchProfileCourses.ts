import { connectDB } from "../lib/mongodb";
import BatchProfile from "../models/BatchProfile";
import Student from "../models/Student";

const main = async () => {
  await connectDB();

  const profiles = await BatchProfile.find({}).select("admissionNo").lean<Array<{ admissionNo?: string }>>();
  const admissionNos = profiles.map((profile) => profile.admissionNo).filter(Boolean);
  const students = await Student.find({ admissionNo: { $in: admissionNos } })
    .select("admissionNo course")
    .lean<Array<{ admissionNo: string; course?: string }>>();
  const courseByAdmission = new Map(
    students.map((student) => [student.admissionNo, student.course === "AI/ML" ? "AI/ML" : "CSE"])
  );

  const operations = profiles.flatMap((profile) => {
    const admissionNo = profile.admissionNo ?? "";
    const course = courseByAdmission.get(admissionNo);
    if (!course) return [];
    return [{ updateOne: { filter: { admissionNo }, update: { $set: { course } } } }];
  });

  if (operations.length > 0) {
    await BatchProfile.bulkWrite(operations, { ordered: false });
  }

  console.log(`Updated ${operations.length} portfolio profile courses.`);
  console.log({
    cse: await BatchProfile.countDocuments({ course: "CSE" }),
    aiMl: await BatchProfile.countDocuments({ course: "AI/ML" }),
  });
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
