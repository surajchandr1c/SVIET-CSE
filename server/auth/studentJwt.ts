import jwt from "jsonwebtoken";

export type StudentJwtPayload = {
  sub: string;
  admissionNo: string;
  role: "student";
  semester: number;
  name: string;
};

const getStudentJwtSecret = (): string => {
  const secret = process.env.STUDENT_JWT_SECRET ?? process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("STUDENT_JWT_SECRET (or JWT_SECRET) is not defined");
  }
  return secret;
};

export const signStudentToken = (payload: StudentJwtPayload): string => {
  return jwt.sign(payload, getStudentJwtSecret(), { expiresIn: "7d" });
};

export const verifyStudentToken = (token: string): StudentJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, getStudentJwtSecret());
    if (typeof decoded !== "object" || decoded === null) return null;
    return decoded as StudentJwtPayload;
  } catch {
    return null;
  }
};
