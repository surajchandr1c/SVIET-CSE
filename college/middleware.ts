import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow admin login page without token
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  // ❌ If no token → redirect to /admin/login
  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    const decoded: any = jwtDecode(token);

    // ✅ If token expired → redirect to login
    if (decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );

      response.cookies.set("admin_token", "", {
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
