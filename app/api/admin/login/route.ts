import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

const isBcryptHash = (value: string) => /^\$2[aby]\$\d{2}\$/.test(value);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
    const adminPasswordPlain = process.env.ADMIN_PASSWORD?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    if (!adminEmail || (!adminPasswordHash && !adminPasswordPlain)) {
      return NextResponse.json(
        { message: "Admin credentials are not configured" },
        { status: 500 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password);

    if (normalizedEmail !== adminEmail) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    let valid = false;

    if (adminPasswordHash) {
      if (isBcryptHash(adminPasswordHash)) {
        valid = await bcrypt.compare(normalizedPassword, adminPasswordHash);
      } else {
        valid = normalizedPassword === adminPasswordHash;
      }
    }

    if (!valid && adminPasswordPlain) {
      valid = normalizedPassword === adminPasswordPlain;
    }

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken(normalizedEmail);

    const response = NextResponse.json({
      message: "Login successful",
    });

        response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
        path: "/",
      });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
