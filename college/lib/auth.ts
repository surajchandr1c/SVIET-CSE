import jwt from "jsonwebtoken";

/**
 * Make sure JWT_SECRET exists in .env.local
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * Generate JWT Token
 */
export const generateToken = (email: string): string => {
  return jwt.sign(
    { email },          // payload
    JWT_SECRET,         // secret key
    { expiresIn: "1h" } // token expiry
  );
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
