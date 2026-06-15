import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Navbar visibility only needs to know whether a session cookie exists.
  // Actual route protection is handled elsewhere.
  const adminSignedIn = Boolean(cookieStore.get("admin_token")?.value);
  const studentSignedIn = Boolean(cookieStore.get("student_token")?.value);

  const signedIn = adminSignedIn || studentSignedIn;
  const role = adminSignedIn ? ("admin" as const) : studentSignedIn ? ("student" as const) : null;

  return NextResponse.json({
    signedIn,
    role,
    adminSignedIn,
    studentSignedIn,
  });
}
