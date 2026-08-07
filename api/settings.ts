/**
 * /api/settings
 * GET  — public: returns all settings as { key: value } (no secrets stored here).
 * POST — master: upsert one. Body: { key, value, description? }
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, requireMaster } from "./_lib/http.js";

interface SettingRow {
  key: string;
  value: string;
  description: string | null;
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const rows = await query<SettingRow>`SELECT key, value, description FROM system_settings`;
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return json(res, map);
  }

  const payload = requireMaster(req, res);
  if (!payload) return;

  if (req.method === "POST") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const key = String(b.key ?? "").trim();
    const value = String(b.value ?? "");
    const description = b.description ? String(b.description) : null;
    if (!key) return error(res, "key is required.", 400);

    const upserted = await queryOne<SettingRow>`
      INSERT INTO system_settings (key, value, description, updated_at)
      VALUES (${key}, ${value}, ${description}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, system_settings.description), updated_at = NOW()
      RETURNING key, value, description
    `;
    if (!upserted) return error(res, "Failed to save setting.", 500);
    return json(res, { key: upserted.key, value: upserted.value });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
