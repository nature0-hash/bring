/**
 * POST /api/upload  (master only)
 * Body: { filename: string, dataBase64: string, contentType?: string }
 * Uploads an image to Vercel Blob storage and returns its public URL.
 *
 * Requires BLOB_READ_WRITE_TOKEN env var (set automatically by Vercel when
 * you attach a Blob store to the project; for local dev, add it to .env
 * manually — see https://vercel.com/docs/storage/vercel-blob).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { withCors, json, error, requireMaster } from "./_lib/http.js";

const MAX_BYTES = 4.5 * 1024 * 1024; // ~4.5MB (Vercel function body limit)

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return json(res, { error: "Method not allowed." }, 405);
  }

  const payload = requireMaster(req, res);
  if (!payload) return;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return error(
      res,
      "Image storage is not configured yet. Add a Vercel Blob store to this project and set BLOB_READ_WRITE_TOKEN.",
      500
    );
  }

  const b = (req.body ?? {}) as Record<string, unknown>;
  const filename = String(b.filename ?? "upload.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
  const dataBase64 = String(b.dataBase64 ?? "");
  const contentType = b.contentType ? String(b.contentType) : "image/jpeg";

  if (!dataBase64) {
    return error(res, "dataBase64 is required.", 400);
  }

  const cleaned = dataBase64.includes(",") ? dataBase64.split(",")[1] : dataBase64;
  const buffer = Buffer.from(cleaned, "base64");

  if (buffer.byteLength > MAX_BYTES) {
    return error(res, "Image is too large. Please use an image under 4MB.", 413);
  }

  try {
    const blob = await put(`site/${Date.now()}-${filename}`, buffer, {
      access: "public",
      contentType,
    });
    return json(res, { url: blob.url }, 201);
  } catch (err) {
    console.error("[upload]", err);
    return error(res, "Failed to upload image.", 500);
  }
});
