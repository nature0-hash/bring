/**
 * /api/rates
 * POST  — update base_rate for a card. (auth: any logged-in user)
 * PATCH — toggle is_active for a card. (auth: any logged-in user)
 *
 * Body (POST):    { id: number, baseRate: number }
 * Body (PATCH):   { id: number, isActive: boolean }
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { queryOne } from "./_lib/db.js";
import { withCors, json, error, requireAuth } from "./_lib/http.js";

interface CardRow {
  id: number;
  brand: string;
  slug: string;
  image_url: string;
  base_rate: string;
  is_active: boolean;
  updated_at: string;
}

function serialize(r: CardRow) {
  return {
    id: r.id,
    brand: r.brand,
    slug: r.slug,
    imageUrl: r.image_url,
    baseRate: parseFloat(r.base_rate),
    isActive: r.is_active,
    updatedAt: r.updated_at,
  };
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  const payload = requireAuth(req, res);
  if (!payload) return;

  if (req.method !== "POST" && req.method !== "PATCH") {
    return json(res, { error: "Method not allowed." }, 405);
  }

  const body = typeof req.body === "object" && req.body ? (req.body as Record<string, unknown>) : {};
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return error(res, "Valid card id is required.", 400);
  }

  if (req.method === "POST") {
    const baseRate = Number(body.baseRate);
    if (!Number.isFinite(baseRate) || baseRate < 0 || baseRate > 1) {
      return error(
        res,
        "baseRate must be a number between 0 and 1 (e.g. 0.82 for 82%).",
        400
      );
    }

    const updated = await queryOne<CardRow>`
      UPDATE gift_cards
      SET base_rate = ${baseRate.toFixed(4)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, brand, slug, image_url, base_rate, is_active, updated_at
    `;

    if (!updated) return error(res, "Card not found.", 404);
    return json(res, { card: serialize(updated) });
  }

  // PATCH — toggle is_active
  const isActive = Boolean(body.isActive);
  const updated = await queryOne<CardRow>`
    UPDATE gift_cards
    SET is_active = ${isActive}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, brand, slug, image_url, base_rate, is_active, updated_at
  `;

  if (!updated) return error(res, "Card not found.", 404);
  return json(res, { card: serialize(updated) });
});
