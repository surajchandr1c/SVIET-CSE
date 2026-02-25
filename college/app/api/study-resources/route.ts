import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyResource from "@/models/StudyResource";

const DEFAULT_4TH_ASSIGNMENTS = [
  {
    semester: "4th",
    category: "assignment",
    title: "Computer Organization & Architecture",
    code: "BTES401-18",
    link: "https://drive.google.com/drive/folders/16Nm4BkjEWWszv1dIJJrELIw1FsRwNAig?usp=sharing",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Operating Systems",
    code: "BTCS402-18",
    link: "https://drive.google.com/drive/folders/1SN6XwEgCGbqagl02hjGdPlnFANKr_d5R?usp=sharing",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Design & Analysis of Algorithms",
    code: "BTCS403-18",
    link: "https://drive.google.com/drive/folders/1U_scqyRIbzmwUG8pMujovKtIb_C9mbnn?usp=sharing",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Discrete Mathematics",
    code: "BTCS401-18",
    link: "https://drive.google.com/drive/folders/1K4MB_Zx-CX3euAmLoki9c8P1n8mV_CgI?usp=sharing",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Universal Human Values - II",
    code: "HSMC122-18",
    link: "#",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Environmental Studies",
    code: "EVS101-18",
    link: "#",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Development of Societies",
    code: "HSMC101-18",
    link: "#",
  },
  {
    semester: "4th",
    category: "assignment",
    title: "Philosophy",
    code: "HSMC102-18",
    link: "#",
  },
];

const DEFAULT_4TH_NOTES = [
  {
    semester: "4th",
    category: "notes",
    title: "Computer Organization & Architecture",
    code: "BTES401-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Operating Systems",
    code: "BTCS402-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Design & Analysis of Algorithms",
    code: "BTCS403-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Discrete Mathematics",
    code: "BTCS401-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Universal Human Values - II",
    code: "HSMC122-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Environmental Studies",
    code: "EVS101-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Development of Societies",
    code: "HSMC101-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "notes",
    title: "Philosophy",
    code: "HSMC102-18",
    link: "/update",
  },
];

const DEFAULT_4TH_PPT = [
  {
    semester: "4th",
    category: "ppt",
    title: "Computer Organization & Architecture",
    code: "BTES401-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "ppt",
    title: "Operating Systems",
    code: "BTCS402-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "ppt",
    title: "Design & Analysis of Algorithms",
    code: "BTCS403-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "ppt",
    title: "Discrete Mathematics",
    code: "BTCS406-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "ppt",
    title: "Universal Human Values - II",
    code: "BTHU401-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "ppt",
    title: "Environmental Studies",
    code: "BTES408-18",
    link: "/update",
  },
  {
    semester: "4th",
    category: "ppt",
    title: "Development of Societies",
    code: "BTDS409-18",
    link: "/update",
  },
];

const getDefaultResources = (semester: string, category: string) => {
  if (semester !== "4th") return [];
  if (category === "assignment") return DEFAULT_4TH_ASSIGNMENTS;
  if (category === "notes") return DEFAULT_4TH_NOTES;
  if (category === "ppt") return DEFAULT_4TH_PPT;
  return [];
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const category = searchParams.get("category");

    const filter: Record<string, string> = {};
    if (semester) filter.semester = semester;
    if (category) filter.category = category;

    let resources = await StudyResource.find(filter).sort({ createdAt: -1 });

    if (semester && category && resources.length === 0) {
      const defaults = getDefaultResources(semester, category);
      if (defaults.length > 0) {
        await StudyResource.insertMany(defaults);
        resources = await StudyResource.find(filter).sort({ createdAt: -1 });
      }
    }

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Study resources fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newResource = await StudyResource.create(body);
    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error("Study resources create error:", error);
    return NextResponse.json(
      { error: "Failed to create study resource" },
      { status: 500 }
    );
  }
}
