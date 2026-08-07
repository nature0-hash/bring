/**
 * /api/staff
 * GET    — public: list active staff, ordered. ?includeInactive=1 (master only) returns all.
 * POST   — master: create. Body: { name, roleLabel?, whatsappNumber, imageUrl?, sortOrder? }
 * PATCH  — master: update. Body: { id, ...fields }
 * DELETE — master: delete. Query: ?id=
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, getAuth, requireMaster } from "./_lib/http.js";

interface StaffRow {
  id: number;
  name: string;
  role_label: string | null;
  whatsapp_number: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

function serialize(r: StaffRow) {
  return {
    id: r.id,
    name: r.name,
    roleLabel: r.role_label,
    whatsappNumber: r.whatsapp_number,
    imageUrl: r.image_url,
    isActive: r.is_active,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  };
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const auth = getAuth(req);
    const includeInactive = req.query.includeInactive === "1" && auth?.role === "master";
    const rows = includeInactive
      ? await query<StaffRow>`SELECT * FROM staff ORDER BY sort_order ASC, created_at ASC`
      : await query<StaffRow>`SELECT * FROM staff WHERE is_active = true ORDER BY sort_order ASC, created_at ASC`;
    return json(res, rows.map(serialize));
  }

  const payload = requireMaster(req, res);
  if (!payload) return;

  if (req.method === "POST") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const name = String(b.name ?? "").trim();
    const roleLabel = b.roleLabel ? String(b.roleLabel).trim() : null;
    const whatsappNumber = String(b.whatsappNumber ?? "").trim();
    const imageUrl = b.imageUrl ? String(b.imageUrl) : null;
    const sortOrder = Number(b.sortOrder) || 0;

    if (!name) return error(res, "Name is required.", 400);
    if (!/^[0-9]{7,15}$/.test(whatsappNumber)) {
      return error(res, "whatsappNumber must be digits only, with country code, no + or spaces (e.g. 2348012345678).", 400);
    }

    const created = await queryOne<StaffRow>`
      INSERT INTO staff (name, role_label, whatsapp_number, image_url, sort_order)
      VALUES (${name}, ${roleLabel}, ${whatsappNumber}, ${imageUrl}, ${sortOrder})
      RETURNING *
    `;
    if (!created) return error(res, "Failed to create staff member.", 500);
    return json(res, { staff: serialize(created) }, 201);
  }

  if (req.method === "PATCH") {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const id = Number(b.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);

    const existing = await queryOne<StaffRow>`SELECT * FROM staff WHERE id = ${id}`;
    if (!existing) return error(res, "Staff member not found.", 404);

    const name = b.name !== undefined ? String(b.name) : existing.name;
    const roleLabel = b.roleLabel !== undefined ? String(b.roleLabel) : existing.role_label;
    const whatsappNumber = b.whatsappNumber !== undefined ? String(b.whatsappNumber) : existing.whatsapp_number;
    const imageUrl = b.imageUrl !== undefined ? String(b.imageUrl) : existing.image_url;
    const isActive = b.isActive !== undefined ? Boolean(b.isActive) : existing.is_active;
    const sortOrder = b.sortOrder !== undefined ? Number(b.sortOrder) : existing.sort_order;

    if (b.whatsappNumber !== undefined && !/^[0-9]{7,15}$/.test(whatsappNumber)) {
      return error(res, "whatsappNumber must be digits only, with country code.", 400);
    }

    const updated = await queryOne<StaffRow>`
      UPDATE staff
      SET name = ${name}, role_label = ${roleLabel}, whatsapp_number = ${whatsappNumber},
          image_url = ${imageUrl}, is_active = ${isActive}, sort_order = ${sortOrder}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updated) return error(res, "Failed to update staff member.", 500);
    return json(res, { staff: serialize(updated) });
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return error(res, "Valid id is required.", 400);
    const deleted = await queryOne<{ id: number }>`DELETE FROM staff WHERE id = ${id} RETURNING id`;
    if (!deleted) return error(res, "Staff member not found.", 404);
    return json(res, { ok: true });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
