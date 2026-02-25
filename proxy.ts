import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type AdminTokenPayload = {
  exp?: number;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const decoded = jwtDecode<AdminTokenPayload>(token);

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));

      response.cookies.set("admin_token", "", {
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
