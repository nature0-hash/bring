/**
 * /api/card-rates
 * GET    — public: list rates. Query: ?cardId= (required), optional &countryId=
 * POST   — auth: create/update a rate. Body: { cardId, countryId, faceValue, localRate }
 * PATCH  — auth: toggle is_active. Body: { id, isActive }
 * DELETE — auth: delete a rate row. Query: ?id=
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, requireAuth } from "./_lib/http.js";

interface RateRow {
  id: number;
  card_id: number;
  country_id: number;
  face_value: string;
  local_rate: string;
  is_active: boolean;
  updated_at: string;
  country_code?: string;
  country_name?: string;
  currency_code?: string;
  currency_symbol?: string;
}

function serialize(r: RateRow) {
  return {
    id: r.id,
    cardId: r.card_id,
    countryId: r.country_id,
    faceValue: parseFloat(r.face_value),
    localRate: parseFloat(r.local_rate),
    isActive: r.is_active,
    updatedAt: r.updated_at,
    countryCode: r.country_code,
    countryName: r.country_name,
    currencyCode: r.currency_code,
    currencySymbol: r.currency_symbol,
  };
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const cardId = Number(req.query.cardId);
    if (!Number.isInteger(cardId) || cardId <= 0) {
      return error(res, "Valid cardId query param is required.", 400);
    }
    const countryId = req.query.countryId ? Number(req.query.countryId) : null;

    const rows = countryId
      ? await query<RateRow>`
          SELECT cr.*, c.code AS country_code, c.name AS country_name,
                 c.currency_code, c.currency_symbol
          FROM card_rates cr
          JOIN countries c ON c.id = cr.country_id
          WHERE cr.card_id = ${cardId} AND cr.country_id = ${countryId} AND cr.is_active = true
          ORDER BY cr.face_value ASC
        `
      : await query<RateRow>`
          SELECT cr.*, c.code AS country_code, c.name AS country_name,
                 c.currency_code, c.currency_symbol
          FROM card_rates cr
          JOIN countries c ON c.id = cr.country_id
          WHERE cr.card_id = ${cardId} AND cr.is_active = true
          ORDER BY c.sort_order ASC, cr.face_value ASC
        `;
    return json(res, rows.map(serialize));
  }

  const payload = requireAuth(req, res);
  if (!payload) return;

  if (req.method === "POST") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const cardId = Number(b.cardId);
    const countryId = Number(b.countryId);
    const faceValue = Number(b.faceValue);
    const localRate = Number(b.localRate);

    if (!Number.isInteger(cardId) || !Number.isInteger(countryId)) {
      return error(res, "cardId and countryId are required.", 400);
    }
    if (!Number.isFinite(faceValue) || faceValue <= 0) {
      return error(res, "faceValue must be a positive number.", 400);
    }
    if (!Number.isFinite(localRate) || localRate < 0) {
      return error(res, "localRate must be a non-negative number.", 400);
    }

    const upserted = await queryOne<RateRow>`
      INSERT INTO card_rates (card_id, country_id, face_value, local_rate)
      VALUES (${cardId}, ${countryId}, ${faceValue.toFixed(2)}, ${localRate.toFixed(2)})
      ON CONFLICT (card_id, country_id, face_value)
      DO UPDATE SET local_rate = EXCLUDED.local_rate, is_active = true, updated_at = NOW()
      RETURNING *
    `;
    if (!upserted) return error(res, "Failed to save rate.", 500);
    return json(res, { rate: serialize(upserted) }, 201);
  }

  if (req.method === "PATCH") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const id = Number(b.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);
    const isActive = Boolean(b.isActive);
    const updated = await queryOne<RateRow>`
      UPDATE card_rates SET is_active = ${isActive}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updated) return error(res, "Rate not found.", 404);
    return json(res, { rate: serialize(updated) });
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);
    const deleted = await queryOne<{ id: number }>`DELETE FROM card_rates WHERE id = ${id} RETURNING id`;
    if (!deleted) return error(res, "Rate not found.", 404);
    return json(res, { ok: true });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
