import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

/**
 * Generate JWT Token
 */
export const generateToken = (email: string): string => {
  const jwtSecret = getJwtSecret();
  return jwt.sign(
    { email },          // payload
    jwtSecret,          // secret key
    { expiresIn: "1h" } // token expiry
  );
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string) => {
  try {
    const jwtSecret = getJwtSecret();
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
};
