/**
 * /api/site-images
 * GET  — public: returns all editable site images as { key: url }.
 * POST — master: upsert one. Body: { key, imageUrl }
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, requireMaster } from "./_lib/http.js";

interface ImageRow {
  key: string;
  image_url: string;
  updated_at: string;
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const rows = await query<ImageRow>`SELECT key, image_url, updated_at FROM site_images`;
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.image_url;
    return json(res, map);
  }

  const payload = requireMaster(req, res);
  if (!payload) return;

  if (req.method === "POST") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const key = String(b.key ?? "").trim();
    const imageUrl = String(b.imageUrl ?? "").trim();
    if (!key) return error(res, "key is required.", 400);
    if (!imageUrl) return error(res, "imageUrl is required.", 400);

    const upserted = await queryOne<ImageRow>`
      INSERT INTO site_images (key, image_url, updated_at)
      VALUES (${key}, ${imageUrl}, NOW())
      ON CONFLICT (key) DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW()
      RETURNING key, image_url, updated_at
    `;
    if (!upserted) return error(res, "Failed to save image.", 500);
    return json(res, { key: upserted.key, imageUrl: upserted.image_url });
  }

  if (req.method === "DELETE") {
    const key = String(req.query.key ?? "");
    if (!key) return error(res, "key query param is required.", 400);
    await queryOne<{ key: string }>`DELETE FROM site_images WHERE key = ${key} RETURNING key`;
    return json(res, { ok: true });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
