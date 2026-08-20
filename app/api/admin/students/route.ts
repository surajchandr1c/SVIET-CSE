import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { verifyAdminToken } from "@/lib/auth";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseNonNegativeInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const normalizeSemester = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) {
      const parsed = Number.parseInt(match[0], 10);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeCourse = (value: string | null): "CSE" | "AI/ML" =>
  value?.toUpperCase() === "AI/ML" ? "AI/ML" : "CSE";

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") ?? searchParams.get("admissionNo") ?? "").trim();
    const course = normalizeCourse(searchParams.get("course"));
    // `0` means "all semesters".
    const semester = parseNonNegativeInt(searchParams.get("semester"), 4);
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = Math.min(50, parsePositiveInt(searchParams.get("limit"), 20));

    await connectDB();

    // Use the underlying collection + aggregation to:
    // - avoid Mongoose casting issues with legacy data (e.g. `semester: "4th"` stored as a string)
    // - remove duplicate admission numbers from the list
    const match: Record<string, unknown> & { $and?: Array<Record<string, unknown>> } = {
      admissionNo: { $type: "string", $ne: "" },
    };
    if (semester !== 0) {
      const semesterAliases = [
        semester,
        String(semester),
        `${semester}th`,
        `${semester}th Semester`,
        semester === 4 ? "4th" : semester === 6 ? "6th" : undefined,
      ].filter((v): v is string | number => Boolean(v));

      match.semester = { $in: semesterAliases };
    }

    match.$and = [
      course === "AI/ML"
        ? { course: "AI/ML" }
        : { $or: [{ course: "CSE" }, { course: { $exists: false } }, { course: null }] },
    ];

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      match.$and.push({ $or: [{ name: searchRegex }, { admissionNo: searchRegex }] });
    }

    const col = Student.collection;

    const agg = await col
      .aggregate([
        { $match: match },
        {
          $addFields: {
            __hasPassword: {
              $cond: [
                { $and: [{ $ne: ["$password", null] }, { $ne: ["$password", ""] }] },
                1,
                0,
              ],
            },
          },
        },
        // Pick the "best" doc for an admission no:
        // 1) the one with a password set
        // 2) most recently updated/created (fallback to _id)
        { $sort: { __hasPassword: -1, updatedAt: -1, createdAt: -1, _id: -1 } },
        { $group: { _id: "$admissionNo", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } },
        { $sort: { admissionNo: 1 } },
        {
          $facet: {
            data: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $project: {
                  name: 1,
                  admissionNo: 1,
                  course: 1,
                  semester: 1,
                  mustChangePassword: 1,
                  createdAt: 1,
                },
              },
            ],
            meta: [{ $count: "total" }],
          },
        },
      ])
      .toArray();

    const docs = (agg?.[0]?.data as Array<Record<string, unknown>>) ?? [];
    const total = (agg?.[0]?.meta?.[0]?.total as number | undefined) ?? 0;

    type AggStudentDoc = {
      _id?: unknown;
      name?: unknown;
      admissionNo?: unknown;
      course?: unknown;
      semester?: unknown;
      mustChangePassword?: unknown;
      createdAt?: unknown;
    };

    const students = docs.map((d) => {
      const doc = d as AggStudentDoc;
      return {
        _id: String(doc._id),
        name: String(doc.name ?? ""),
        admissionNo: String(doc.admissionNo ?? ""),
        course: doc.course === "AI/ML" ? "AI/ML" : "CSE",
        semester: normalizeSemester(doc.semester) || (semester === 0 ? 4 : semester),
      mustChangePassword:
        typeof doc.mustChangePassword === "boolean" ? doc.mustChangePassword : true,
        createdAt: doc.createdAt ? new Date(String(doc.createdAt)).toISOString() : undefined,
      };
    });

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      students,
    });
  } catch (error) {
    console.error("Admin students list error:", error);
    return NextResponse.json({ error: "Failed to fetch students." }, { status: 500 });
  }
}
