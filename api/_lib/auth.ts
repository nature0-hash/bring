/**
 * Auth helpers — JWT signing/verification + bcrypt password hashing.
 * Uses master JWT_SECRET env var.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

if (!JWT_SECRET) {
  console.warn("[auth] JWT_SECRET is not set. Login will fail.");
}

export interface JwtPayload {
  sub: number;       // user id
  username: string;
  role: "master" | "staff";
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token: string): JwtPayload | null {
  if (!JWT_SECRET || !token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
