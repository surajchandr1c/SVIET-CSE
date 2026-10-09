import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { verifyStudentToken } from "@/lib/studentAuth";

export async function GET() {
  const cookieStore = await cookies();

  const adminToken = cookieStore.get("admin_token")?.value;
  const studentToken = cookieStore.get("student_token")?.value;

  const adminSignedIn = Boolean(adminToken && verifyAdminToken(adminToken));
  const studentSignedIn = Boolean(studentToken && verifyStudentToken(studentToken));

  const signedIn = adminSignedIn || studentSignedIn;
  const role = adminSignedIn ? ("admin" as const) : studentSignedIn ? ("student" as const) : null;

  return NextResponse.json({
    signedIn,
    role,
    adminSignedIn,
    studentSignedIn,
  });
}
