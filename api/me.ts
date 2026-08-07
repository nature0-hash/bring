/**
 * GET /api/me
 * Requires: Authorization: Bearer <token>
 * Returns the current authenticated user.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { queryOne } from "./_lib/db.js";
import { withCors, json, error, requireAuth } from "./_lib/http.js";

interface UserRow {
  id: number;
  username: string;
  role: "master" | "staff";
  created_at: string;
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    return json(res, { error: "Method not allowed." }, 405);
  }

  const payload = requireAuth(req, res);
  if (!payload) return;

  const user = await queryOne<UserRow>`
    SELECT id, username, role, created_at FROM users WHERE id = ${payload.sub}
  `;

  if (!user) {
    return error(res, "User no longer exists.", 404);
  }

  return json(res, {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.created_at,
    },
  });
});
