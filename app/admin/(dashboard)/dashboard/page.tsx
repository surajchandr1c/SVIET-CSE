import Link from "next/link";
import {
  Bell,
  GraduationCap,
  Image,
  UserRound,
  Users,
} from "lucide-react";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import Notice from "@/models/Notice";
import Student from "@/models/Student";
import TechxploreStudent from "@/models/TechxploreStudent";
import { getBatchProfiles } from "@/lib/batchProfiles";

export const dynamic = "force-dynamic";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".svg",
  ".avif",
]);

const countImagesInDirectory = async (dirPath: string): Promise<number> => {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    let total = 0;

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        total += await countImagesInDirectory(fullPath);
        continue;
      }

      if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        total += 1;
      }
    }

    return total;
  } catch {
    return 0;
  }
};

const countSemesterStudents = async (semester: number) => {
  const col = Student.collection;
  const semesterAliases = [
    semester,
    String(semester),
    `${semester}th`,
    `${semester}th Semester`,
    semester === 4 ? "4th" : undefined,
    semester === 6 ? "6th" : undefined,
  ].filter((v): v is string | number => Boolean(v));

  const agg = await col
    .aggregate([
      {
        $match: {
          admissionNo: { $type: "string", $ne: "" },
          semester: { $in: semesterAliases },
        },
      },
      { $group: { _id: "$admissionNo" } },
      { $count: "total" },
    ])
    .toArray();

  return (agg?.[0]?.total as number | undefined) ?? 0;
};

const getDashboardStats = async () => {
  const defaultStats = {
    facultyCount: 0,
    techxploreCount: 0,
    noticeCount: 0,
    fourthSemStudentCount: 0,
    sixthSemStudentCount: 0,
    galleryImageCount: 0,
  };

  try {
    await connectDB();

    const publicDir = path.join(process.cwd(), "public");

    const [
      facultyCount,
      techxploreCount,
      noticeCount,
      fourthSemStudentCount,
      sixthSemStudentCount,
      galleryImageCount,
    ] = await Promise.all([
      Faculty.countDocuments(),
      TechxploreStudent.countDocuments(),
      Notice.countDocuments(),
      countSemesterStudents(4),
      countSemesterStudents(6),
      countImagesInDirectory(path.join(publicDir, "events")),
    ]);

    return {
      facultyCount,
      techxploreCount,
      noticeCount,
      fourthSemStudentCount,
      sixthSemStudentCount,
      galleryImageCount,
    };
  } catch {
    return defaultStats;
  }
};

export default async function AdminDashboard() {
  const [stats, portfolio4, portfolio6] = await Promise.all([
    getDashboardStats(),
    getBatchProfiles("4"),
    getBatchProfiles("6"),
  ]);
  const portfolio4Count = portfolio4.length;
  const portfolio6Count = portfolio6.length;

  const actions = [
    {
      title: "Manage Faculty",
      description: "Add, update and organize department faculty profiles.",
      href: "/admin/faculty/add",
      icon: UserRound,
      count: stats.facultyCount,
      metricLabel: "Teachers added",
    },
    {
      title: "Manage TechXplore",
      description: "Add and maintain student data for the TechXplore page.",
      href: "/admin/techxplore",
      icon: UserRound,
      count: stats.techxploreCount,
      metricLabel: "Students added",
    },
    {
      title: "Manage Gallery",
      description: "Organize event gallery content from admin panel.",
      href: "/admin/gallery",
      icon: Image,
      count: stats.galleryImageCount,
      metricLabel: "Images added",
    },
    {
      title: "Update Notice Board",
      description: "Publish and edit notices for all students quickly.",
      href: "/admin/notice",
      icon: Bell,
      count: stats.noticeCount,
      metricLabel: "Notices uploaded",
    },
    {
      title: "Student Portfolio (2024 Batch)",
      description: "View 2024 batch student portfolio profiles.",
      href: "/admin/studentportfolio?tab=2024",
      icon: Users,
      count: portfolio4Count,
      metricLabel: "Profiles",
    },
    {
      title: "Student Portfolio (2023 Batch)",
      description: "View 2023 batch student portfolio profiles.",
      href: "/admin/studentportfolio?tab=2023",
      icon: Users,
      count: portfolio6Count,
      metricLabel: "Profiles",
    },
    {
      title: "Semester Content",
      description: "Manage 4th and 5th semester learning content.",
      href: "/admin/semester",
      icon: GraduationCap,
      count: stats.fourthSemStudentCount,
      metricLabel: "Students in 4th semester",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="admin-card p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
            Admin Workspace
          </p>
          <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
            Welcome back, Admin
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
            Use the quick actions below to maintain faculty records, notices, and semester content from one place.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="admin-kpi group p-5 transition duration-200 hover:-translate-y-1"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--admin-muted)] text-[var(--admin-accent-strong)]">
                    <Icon size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[var(--admin-text)]">{action.count}</p>
                    <p className="text-xs text-[var(--admin-text-muted)]">{action.metricLabel}</p>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-[var(--admin-text)]">{action.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--admin-text-muted)]">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
