/**
 * POST /api/login
 * Body: { username: string, password: string }
 * Returns: { token: string, user: { id, username, role, createdAt } }
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { queryOne } from "./_lib/db.js";
import { withCors, json, error } from "./_lib/http.js";
import { signToken, verifyPassword } from "./_lib/auth.js";

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: "master" | "staff";
  created_at: string;
}

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return json(res, { error: "Method not allowed." }, 405);
  }

  const { username, password } = typeof req.body === "object" && req.body
    ? (req.body as { username?: string; password?: string })
    : { username: undefined, password: undefined };

  if (!username || !password) {
    return error(res, "Username and password are required.", 400);
  }

  const user = await queryOne<UserRow>`
    SELECT id, username, password_hash, role, created_at
    FROM users WHERE username = ${username.trim()}
  `;

  if (!user) {
    return error(res, "Invalid username or password.", 401);
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return error(res, "Invalid username or password.", 401);
  }

  const token = signToken({
    sub: user.id,
    username: user.username,
    role: user.role,
  });

  return json(res, {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.created_at,
    },
  });
});
