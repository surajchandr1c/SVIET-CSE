import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import Student from "../models/Student";
import students from "../data/students2025AiMl.json";
import { initialPasswordForAdmission } from "../lib/studentCredentials";

type SeedStudent = {
  admissionNo: string;
  name: string;
};

const main = async () => {
  const rows = students as SeedStudent[];
  const admissionNos = rows.map((student) => student.admissionNo.toUpperCase());
  await connectDB();

  const existing = await Student.find({ admissionNo: { $in: admissionNos } })
    .select("+password admissionNo mustChangePassword")
    .lean<Array<{ admissionNo: string; password?: string; mustChangePassword?: boolean }>>();
  const existingByAdmission = new Map(existing.map((student) => [student.admissionNo, student]));
  const passwords: string[] = [];
  const operations = [];

  for (const row of rows) {
    const admissionNo = row.admissionNo.toUpperCase();
    const previous = existingByAdmission.get(admissionNo);
    const hasPassword = Boolean(previous?.password);
    const plainPassword = hasPassword ? null : initialPasswordForAdmission(admissionNo);
    const passwordHash = plainPassword ? await bcrypt.hash(plainPassword, 10) : null;

    if (plainPassword) passwords.push(`${admissionNo} | ${plainPassword}`);

    operations.push({
      updateOne: {
        filter: { admissionNo },
        update: {
          $set: {
            name: row.name.trim(),
            admissionNo,
            semester: 2,
            course: "AI/ML",
            role: "student",
            ...(passwordHash
              ? { password: passwordHash, mustChangePassword: true }
              : previous?.mustChangePassword !== undefined
                ? { mustChangePassword: previous.mustChangePassword }
                : {}),
          },
        },
        upsert: true,
      },
    });
  }

  await Student.bulkWrite(operations, { ordered: false });

  console.log(`Seeded ${rows.length} 2025 AI/ML students.`);
  console.log(
    `Verified database count: ${await Student.countDocuments({ semester: 2, course: "AI/ML", admissionNo: /^2025/ })}`
  );
  console.log(`Initialized ${passwords.length} new passwords.`);
  for (const password of passwords) console.log(password);
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
