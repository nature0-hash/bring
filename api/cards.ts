/**
 * /api/cards
 * GET    — public: all active gift cards. ?includeInactive=1 (master only) returns all.
 * POST   — master: create a new gift card. Body: { brand, slug, imageUrl, baseRate, category? }
 * PATCH  — master: update a card's brand/image/category/slug. Body: { id, ...fields }
 * DELETE — master: delete a card. Query: ?id=
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, getAuth, requireMaster } from "./_lib/http.js";

interface CardRow {
  id: number;
  brand: string;
  slug: string;
  image_url: string;
  base_rate: string;
  is_active: boolean;
  category: string | null;
  sort_order: number;
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
    category: r.category,
    sortOrder: r.sort_order,
    updatedAt: r.updated_at,
  };
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const auth = getAuth(req);
    const includeInactive = req.query.includeInactive === "1" && auth?.role === "master";
    const rows = includeInactive
      ? await query<CardRow>`SELECT * FROM gift_cards ORDER BY sort_order ASC, id ASC`
      : await query<CardRow>`SELECT * FROM gift_cards WHERE is_active = true ORDER BY sort_order ASC, id ASC`;
    return json(res, rows.map(serialize));
  }

  const payload = requireMaster(req, res);
  if (!payload) return;

  if (req.method === "POST") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const brand = String(b.brand ?? "").trim();
    const slug = String(b.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-");
    const imageUrl = String(b.imageUrl ?? "").trim();
    const baseRate = Number(b.baseRate);
    const category = b.category ? String(b.category) : null;
    const sortOrder = Number(b.sortOrder) || 0;

    if (!brand || !slug) {
      return error(res, "brand and slug are required.", 400);
    }
    if (!Number.isFinite(baseRate) || baseRate < 0 || baseRate > 1) {
      return error(res, "baseRate must be a number between 0 and 1 (e.g. 0.82 for 82%).", 400);
    }

    const created = await queryOne<CardRow>`
      INSERT INTO gift_cards (brand, slug, image_url, base_rate, category, sort_order)
      VALUES (${brand}, ${slug}, ${imageUrl}, ${baseRate.toFixed(4)}, ${category}, ${sortOrder})
      RETURNING *
    `;
    if (!created) return error(res, "Failed to create card (slug may already be taken).", 500);
    return json(res, { card: serialize(created) }, 201);
  }

  if (req.method === "PATCH") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const id = Number(b.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);

    const existing = await queryOne<CardRow>`SELECT * FROM gift_cards WHERE id = ${id}`;
    if (!existing) return error(res, "Card not found.", 404);

    const brand = b.brand !== undefined ? String(b.brand) : existing.brand;
    const slug = b.slug !== undefined ? String(b.slug).trim().toLowerCase().replace(/\s+/g, "-") : existing.slug;
    const imageUrl = b.imageUrl !== undefined ? String(b.imageUrl) : existing.image_url;
    const category = b.category !== undefined ? String(b.category) : existing.category;
    const isActive = b.isActive !== undefined ? Boolean(b.isActive) : existing.is_active;
    const sortOrder = b.sortOrder !== undefined ? Number(b.sortOrder) : existing.sort_order;
    const baseRate = b.baseRate !== undefined ? Number(b.baseRate) : parseFloat(existing.base_rate);

    if (b.baseRate !== undefined && (!Number.isFinite(baseRate) || baseRate < 0 || baseRate > 1)) {
      return error(res, "baseRate must be a number between 0 and 1.", 400);
    }
    if (b.slug !== undefined && !slug) {
      return error(res, "Slug cannot be empty.", 400);
    }

    const updated = await queryOne<CardRow>`
      UPDATE gift_cards
      SET brand = ${brand}, slug = ${slug}, image_url = ${imageUrl}, category = ${category},
          is_active = ${isActive}, sort_order = ${sortOrder},
          base_rate = ${baseRate.toFixed(4)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updated) return error(res, "Failed to update card.", 500);
    return json(res, { card: serialize(updated) });
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);
    const deleted = await queryOne<{ id: number }>`DELETE FROM gift_cards WHERE id = ${id} RETURNING id`;
    if (!deleted) return error(res, "Card not found.", 404);
    return json(res, { ok: true });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
