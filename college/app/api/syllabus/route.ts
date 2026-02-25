import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Syllabus from "@/models/Syllabus";

const DEFAULT_4TH_SUBJECTS = [
  {
    semester: "4th",
    title: "Computer Organization & Architecture",
    code: "BTES401-18",
    link: "/syllabus/4thsem/Computer organization and architecture.pdf",
  },
  {
    semester: "4th",
    title: "Operating Systems",
    code: "BTCS402-18",
    link: "/syllabus/4thsem/Operating system.pdf",
  },
  {
    semester: "4th",
    title: "Design & Analysis of Algorithms",
    code: "BTCS403-18",
    link: "/syllabus/4thsem/Design and Analysis of Algorithms.pdf",
  },
  {
    semester: "4th",
    title: "Discrete Mathematics",
    code: "BTCS401-18",
    link: "/syllabus/4thsem/Discrete mathematics.pdf",
  },
  {
    semester: "4th",
    title: "Universal Human Values - II",
    code: "HSMC122-18",
    link: "#",
  },
  {
    semester: "4th",
    title: "Environmental Studies",
    code: "EVS101-18",
    link: "/syllabus/4thsem/Environmental studies.pdf",
  },
  {
    semester: "4th",
    title: "Development of Societies",
    code: "HSMC101-18",
    link: "/syllabus/4thsem/Hv.pdf",
  },
  {
    semester: "4th",
    title: "Philosophy",
    code: "HSMC102-18",
    link: "/syllabus/4thsem/Philosophy.pdf",
  },
];

const DEFAULT_6TH_SUBJECTS = [
  {
    semester: "6th",
    title: "Compiler Design",
    code: "BTCS601-18",
    link: "/image/syllabus/6thsem/Compiler Design.pdf",
  },
  {
    semester: "6th",
    title: "Artificial Intelligence",
    code: "BTCS602-18",
    link: "/image/syllabus/6thsem/AI.pdf",
  },
  {
    semester: "6th",
    title: "Cloud Computing",
    code: "BTCS603-18",
    link: "/image/syllabus/6thsem/Cloud computing.pdf",
  },
  {
    semester: "6th",
    title: "Simulation and Modeling",
    code: "BTCS604-18",
    link: "/image/syllabus/6thsem/Simulation and modeling.pdf",
  },
  {
    semester: "6th",
    title: "Internet of Things",
    code: "BTCS605-18",
    link: "/image/syllabus/6thsem/Internet of things.pdf",
  },
  {
    semester: "6th",
    title: "Digital Image Processing",
    code: "OE-6XX",
    link: "/image/syllabus/6thsem/Digital image processing.pdf",
  },
  {
    semester: "6th",
    title: "Software Project Management",
    code: "OE-6XX",
    link: "#",
  },
  {
    semester: "6th",
    title: "Machine Learning",
    code: "OE-6XX",
    link: "#",
  },
  {
    semester: "6th",
    title: "Mobile Application Development",
    code: "OE-6XX",
    link: "#",
  },
];

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");

    const filter = semester ? { semester } : {};
    let syllabus = await Syllabus.find(filter).sort({ createdAt: -1 });

    if (semester === "4th" && syllabus.length === 0) {
      await Syllabus.insertMany(DEFAULT_4TH_SUBJECTS);
      syllabus = await Syllabus.find(filter).sort({ createdAt: -1 });
    }

    if (semester === "6th" && syllabus.length === 0) {
      await Syllabus.insertMany(DEFAULT_6TH_SUBJECTS);
      syllabus = await Syllabus.find(filter).sort({ createdAt: -1 });
    }

    return NextResponse.json(syllabus);
  } catch (error) {
    console.error("Syllabus fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch syllabus" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newItem = await Syllabus.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Syllabus create error:", error);
    return NextResponse.json(
      { error: "Failed to create syllabus item" },
      { status: 500 }
    );
  }
}
