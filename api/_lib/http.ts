/**
 * Shared helpers for Vercel serverless function responses.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyToken, type JwtPayload } from "./auth.js";

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export function json<T = unknown>(
  res: VercelResponse,
  body: T,
  status = 200
): VercelResponse {
  return res.status(status).json(body);
}

export function error(
  res: VercelResponse,
  message: string,
  status = 400,
  details?: string
): VercelResponse {
  return res.status(status).json({ error: message, details });
}

/** Handle CORS preflight + attach CORS headers to all responses + catch errors. */
export function withCors(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      res.setHeader(k, v);
    }
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    try {
      return await handler(req, res);
    } catch (err) {
      console.error("[api]", err);
      const message = err instanceof Error ? err.message : "Internal server error.";
      return error(res, message, 500);
    }
  };
}

/** Extract and verify the Bearer token from the Authorization header. */
export function getAuth(req: VercelRequest): JwtPayload | null {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer ")) return null;
  return verifyToken(header.slice(7));
}

/** Require auth — returns the payload or sends a 401 and returns null. */
export function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): JwtPayload | null {
  const payload = getAuth(req);
  if (!payload) {
    error(res, "Unauthorized. Please sign in again.", 401);
    return null;
  }
  return payload;
}

/** Require master role — returns the payload or sends 403 and returns null. */
export function requireMaster(
  req: VercelRequest,
  res: VercelResponse
): JwtPayload | null {
  const payload = requireAuth(req, res);
  if (!payload) return null;
  if (payload.role !== "master") {
    error(res, "Forbidden. Master access required.", 403);
    return null;
  }
  return payload;
}
