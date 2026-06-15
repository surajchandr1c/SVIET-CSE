import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyStudentToken } from "@/lib/studentAuth";

export async function GET() {
  const token = (await cookies()).get("student_token")?.value;
  const signedIn = Boolean(token && verifyStudentToken(token));
  return NextResponse.json({ signedIn });
}

