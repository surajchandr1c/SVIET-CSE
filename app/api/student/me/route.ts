import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyStudentToken } from "@/lib/studentAuth";

export async function GET() {
  const token = (await cookies()).get("student_token")?.value;
  if (!token) return NextResponse.json({ signedIn: false }, { status: 200 });

  const payload = verifyStudentToken(token);
  if (!payload) return NextResponse.json({ signedIn: false }, { status: 200 });

  return NextResponse.json({ signedIn: true, student: payload });
}

