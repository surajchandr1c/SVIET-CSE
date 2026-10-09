import { cookies } from "next/headers";
import { verifyAdminToken } from "@/server/auth/adminJwt";

export * from "@/server/auth/adminJwt";

export async function checkAdminAuth(req?: Request): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (token && verifyAdminToken(token)) return true;

    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const headerToken = authHeader.substring(7);
        if (verifyAdminToken(headerToken)) return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}
