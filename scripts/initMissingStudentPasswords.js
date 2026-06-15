/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

const loadEnvLocal = async () => {
  if (process.env.MONGODB_URI) return;
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore
  }
};

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    admissionNo: { type: String, required: true, trim: true },
    password: { type: String, required: false },
    semester: { type: Number, required: true, default: 4 },
    role: { type: String, required: true, default: "student" },
    mustChangePassword: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

const normalizeAdmissionNo = (value) => String(value ?? "").trim().toUpperCase();

const normalizeName = (row) =>
  String(row?.name ?? row?.Name ?? "")
    .trim()
    .replace(/\s+/g, " ");

const initialPasswordForAdmission = (admissionNo) => {
  const match = String(admissionNo).match(/(\d{3,4})$/);
  const suffix = String(match?.[1] ?? "0000").padStart(4, "0");
  return `SVIET@${suffix}`;
};

const loadJson = async (filePath) => {
  const raw = await readFile(filePath, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
};

const main = async () => {
  const root = process.cwd();
  const students4Path = path.join(root, "data", "students4thSem.json");
  const students6Path = path.join(root, "data", "students6thSem.json");

  const [students4, students6] = await Promise.all([
    loadJson(students4Path),
    loadJson(students6Path),
  ]);

  const all = [
    ...students4.map((s) => ({ ...s, semester: 4 })),
    ...students6.map((s) => ({ ...s, semester: 6 })),
  ];

  const admissionNos = Array.from(
    new Set(all.map((r) => normalizeAdmissionNo(r?.admissionNo)).filter(Boolean))
  );

  await loadEnvLocal();
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined (set it in `.env.local`).");
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

  const existing = await Student.find({ admissionNo: { $in: admissionNos } })
    .select("+password admissionNo")
    .lean();

  const hasPassword = new Set(
    existing
      .filter((s) => Boolean(s?.password && String(s.password).length > 0))
      .map((s) => String(s.admissionNo ?? "").trim().toUpperCase())
  );

  let updatedCount = 0;
  const ops = [];

  for (const row of all) {
    const admissionNo = normalizeAdmissionNo(row?.admissionNo);
    const name = normalizeName(row);
    const semester = row?.semester === 6 ? 6 : 4;
    if (!admissionNo || !name) continue;
    if (hasPassword.has(admissionNo)) continue;

    const plain = initialPasswordForAdmission(admissionNo);
    const hashed = await bcrypt.hash(plain, 10);

    updatedCount += 1;
    ops.push({
      updateOne: {
        filter: { admissionNo },
        update: {
          $set: {
            name,
            admissionNo,
            semester,
            role: "student",
            password: hashed,
            mustChangePassword: true,
          },
        },
        upsert: true,
      },
    });
  }

  if (ops.length > 0) {
    await Student.bulkWrite(ops, { ordered: false });
  }

  console.log(`Initialized passwords for ${updatedCount} student(s).`);
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
