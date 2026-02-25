import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import QuestionPaper from "@/models/QuestionPaper";

const DEFAULT_4TH_PAPERS = [
  {
    semester: "4th",
    title: "Computer Organization & Architecture",
    code: "BTES401-18",
    link: "https://drive.google.com/drive/folders/11xVACMczDfQfuPCjDtxaAAJOopvsCUcI?usp=sharing",
  },
  {
    semester: "4th",
    title: "Design & Analysis of Algorithms",
    code: "BTCS403-18",
    link: "https://drive.google.com/drive/folders/1eEfQWbwyNZXosDbTYiphGlIjWYjq-_9C?usp=sharing",
  },
  {
    semester: "4th",
    title: "Discrete Mathematics",
    code: "BTCS406-18",
    link: "https://drive.google.com/drive/folders/1V7FsXKwzuziT8xnLS0cSUTl7eNfKF6xb?usp=sharing",
  },
  {
    semester: "4th",
    title: "Operating System",
    code: "BTCS402-18",
    link: "https://drive.google.com/drive/folders/1pd5kpm0Amjda4__QOmUqfW3Rqjupa2Z5?usp=sharing",
  },
  {
    semester: "4th",
    title: "Universal Human Values",
    code: "BTHU401-18",
    link: "https://drive.google.com/drive/folders/1BWMcQcxaBeyynUoU3i287k6SxXoFsdI9?usp=sharing",
  },
];

const DEFAULT_6TH_PAPERS = [
  {
    semester: "6th",
    title: "Artificial Intelligence",
    code: "N/A",
    link: "https://drive.google.com/drive/folders/1QaoZxyy5OmieIuL2hiZTcfFPHxBbQfSb?usp=sharing",
  },
  {
    semester: "6th",
    title: "Cloud Computing",
    code: "N/A",
    link: "https://drive.google.com/drive/folders/1yFVPqMOgDQ0FPrXUu8MBEGciJJFNPNrG?usp=sharing",
  },
  {
    semester: "6th",
    title: "Compiler Design",
    code: "N/A",
    link: "https://drive.google.com/drive/folders/1BbHA9iXTjT5EGVOfwEszgULAy6BQvOYV?usp=sharing",
  },
  {
    semester: "6th",
    title: "Software Project Management",
    code: "N/A",
    link: "https://drive.google.com/drive/folders/1Bp2rg9jgfcn3IK8V6v-05D-2Plavd4eh?usp=sharing",
  },
  {
    semester: "6th",
    title: "Wireless Communication",
    code: "N/A",
    link: "https://drive.google.com/drive/folders/1-gkwMDcQ9fERVFBZ_lem9uMweAUD95qL?usp=sharing",
  },
];

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const filter = semester ? { semester } : {};

    let papers = await QuestionPaper.find(filter).sort({ createdAt: -1 });

    if (semester === "4th" && papers.length === 0) {
      await QuestionPaper.insertMany(DEFAULT_4TH_PAPERS);
      papers = await QuestionPaper.find(filter).sort({ createdAt: -1 });
    }

    if (semester === "6th" && papers.length === 0) {
      await QuestionPaper.insertMany(DEFAULT_6TH_PAPERS);
      papers = await QuestionPaper.find(filter).sort({ createdAt: -1 });
    }

    return NextResponse.json(papers);
  } catch (error) {
    console.error("Question papers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch question papers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newPaper = await QuestionPaper.create(body);
    return NextResponse.json(newPaper, { status: 201 });
  } catch (error) {
    console.error("Question papers create error:", error);
    return NextResponse.json(
      { error: "Failed to create question paper" },
      { status: 500 }
    );
  }
}
