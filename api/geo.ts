/**
 * GET /api/geo
 * Public. Returns the visitor's country code, detected from Vercel's
 * automatic `x-vercel-ip-country` header (free, no external API needed).
 * In local dev this header doesn't exist, so countryCode will be null and
 * the client falls back to a default.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withCors, json } from "./_lib/http.js";

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    return json(res, { error: "Method not allowed." }, 405);
  }
  const countryCode = (req.headers["x-vercel-ip-country"] as string | undefined) || null;
  return json(res, { countryCode });
});
