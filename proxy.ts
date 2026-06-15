import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { verifyStudentToken } from "@/lib/studentAuth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/techxplore") || pathname.startsWith("/student-list")) {
    const studentToken = request.cookies.get("student_token")?.value;
    const adminToken = request.cookies.get("admin_token")?.value;
    const studentPayload = studentToken ? verifyStudentToken(studentToken) : null;
    const adminPayload = adminToken ? verifyAdminToken(adminToken) : null;

    if (!studentPayload && !adminPayload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("student_token", "", { path: "/", expires: new Date(0) });
      res.cookies.set("admin_token", "", { path: "/", expires: new Date(0) });
      return res;
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/student")) {
    const token = request.cookies.get("student_token")?.value;
    const payload = token ? verifyStudentToken(token) : null;

    if (!payload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("student_token", "", { path: "/", expires: new Date(0) });
      return res;
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;
    const payload = token ? verifyAdminToken(token) : null;

    if (!payload) {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.set("admin_token", "", { path: "/", expires: new Date(0) });
      return res;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/techxplore/:path*", "/student-list/:path*", "/student-list"],
};
