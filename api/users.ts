/**
 * /api/users  (master-only)
 * GET    — list all users.
 * POST   — create a new user.  Body: { username, password, role }
 * DELETE — delete a user.      Query: ?id=<userId>
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query, queryOne } from "./_lib/db.js";
import { withCors, json, error, requireMaster } from "./_lib/http.js";
import { hashPassword } from "./_lib/auth.js";

interface UserRow {
  id: number;
  username: string;
  role: "master" | "staff";
  created_at: string;
}

function serialize(r: UserRow) {
  return {
    id: r.id,
    username: r.username,
    role: r.role,
    createdAt: r.created_at,
  };
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  const payload = requireMaster(req, res);
  if (!payload) return;

  if (req.method === "GET") {
    const rows = await query<UserRow>`
      SELECT id, username, role, created_at FROM users ORDER BY created_at ASC
    `;
    return json(res, { users: rows.map(serialize) });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "object" && req.body ? (req.body as Record<string, unknown>) : {};
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    const role = body.role === "master" ? "master" : "staff";

    if (!username || username.length < 3) {
      return error(res, "Username must be at least 3 characters.", 400);
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return error(res, "Username may only contain letters, numbers, and underscores.", 400);
    }
    if (!password || password.length < 6) {
      return error(res, "Password must be at least 6 characters.", 400);
    }

    // Check for existing user.
    const existing = await queryOne<{ id: number }>`
      SELECT id FROM users WHERE username = ${username}
    `;
    if (existing) {
      return error(res, "Username already taken.", 409);
    }

    const hash = await hashPassword(password);
    const created = await queryOne<UserRow>`
      INSERT INTO users (username, password_hash, role)
      VALUES (${username}, ${hash}, ${role})
      RETURNING id, username, role, created_at
    `;
    if (!created) {
      return error(res, "Failed to create user.", 500);
    }
    return json(res, { user: serialize(created) }, 201);
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) {
      return error(res, "Valid user id is required.", 400);
    }
    if (id === payload.sub) {
      return error(res, "You cannot delete your own account.", 400);
    }
    const deleted = await queryOne<{ id: number }>`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `;
    if (!deleted) return error(res, "User not found.", 404);
    return json(res, { ok: true });
  }

  return json(res, { error: "Method not allowed." }, 405);
});
