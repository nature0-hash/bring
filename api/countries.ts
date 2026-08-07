/**
 * /api/countries
 * GET    — public: list active countries. ?includeInactive=1 (master only) returns all.
 * POST   — master: create a country. Body: { code, name, currencyCode, currencySymbol, flagEmoji?, sortOrder? }
 * PATCH  — master: update a country. Body: { id, ...fields }
 * DELETE — master: delete a country. Query: ?id=
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, getAuth, requireMaster } from "./_lib/http.js";

interface CountryRow {
  id: number;
  code: string;
  name: string;
  currency_code: string;
  currency_symbol: string;
  flag_emoji: string | null;
  is_active: boolean;
  sort_order: number;
}

function serialize(r: CountryRow) {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    currencyCode: r.currency_code,
    currencySymbol: r.currency_symbol,
    flagEmoji: r.flag_emoji,
    isActive: r.is_active,
    sortOrder: r.sort_order,
  };
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const auth = getAuth(req);
    const includeInactive = req.query.includeInactive === "1" && auth?.role === "master";
    const rows = includeInactive
      ? await query<CountryRow>`SELECT * FROM countries ORDER BY sort_order ASC, name ASC`
      : await query<CountryRow>`SELECT * FROM countries WHERE is_active = true ORDER BY sort_order ASC, name ASC`;
    return json(res, rows.map(serialize));
  }

  const payload = requireMaster(req, res);
  if (!payload) return;

  if (req.method === "POST") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const code = String(b.code ?? "").trim().toUpperCase();
    const name = String(b.name ?? "").trim();
    const currencyCode = String(b.currencyCode ?? "").trim().toUpperCase();
    const currencySymbol = String(b.currencySymbol ?? "").trim();
    const flagEmoji = b.flagEmoji ? String(b.flagEmoji) : null;
    const sortOrder = Number(b.sortOrder) || 0;

    if (code.length !== 2 || !name || currencyCode.length !== 3 || !currencySymbol) {
      return error(res, "code (2 letters), name, currencyCode (3 letters), and currencySymbol are required.", 400);
    }

    const created = await queryOne<CountryRow>`
      INSERT INTO countries (code, name, currency_code, currency_symbol, flag_emoji, sort_order)
      VALUES (${code}, ${name}, ${currencyCode}, ${currencySymbol}, ${flagEmoji}, ${sortOrder})
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    if (!created) return error(res, "Failed to create country.", 500);
    return json(res, { country: serialize(created) }, 201);
  }

  if (req.method === "PATCH") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const id = Number(b.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);

    const existing = await queryOne<CountryRow>`SELECT * FROM countries WHERE id = ${id}`;
    if (!existing) return error(res, "Country not found.", 404);

    const name = b.name !== undefined ? String(b.name) : existing.name;
    const currencyCode = b.currencyCode !== undefined ? String(b.currencyCode).toUpperCase() : existing.currency_code;
    const currencySymbol = b.currencySymbol !== undefined ? String(b.currencySymbol) : existing.currency_symbol;
    const flagEmoji = b.flagEmoji !== undefined ? String(b.flagEmoji) : existing.flag_emoji;
    const isActive = b.isActive !== undefined ? Boolean(b.isActive) : existing.is_active;
    const sortOrder = b.sortOrder !== undefined ? Number(b.sortOrder) : existing.sort_order;

    const updated = await queryOne<CountryRow>`
      UPDATE countries
      SET name = ${name}, currency_code = ${currencyCode}, currency_symbol = ${currencySymbol},
          flag_emoji = ${flagEmoji}, is_active = ${isActive}, sort_order = ${sortOrder}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updated) return error(res, "Failed to update country.", 500);
    return json(res, { country: serialize(updated) });
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);
    const deleted = await queryOne<{ id: number }>`DELETE FROM countries WHERE id = ${id} RETURNING id`;
    if (!deleted) return error(res, "Country not found.", 404);
    return json(res, { ok: true });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
