/**
 * Local preview API server.
 *
 * Mounts the Vercel serverless function handlers (api/*.ts) on a plain Express
 * server so the app can be previewed in this environment. Vercel's
 * VercelRequest/VercelResponse are compatible with Express req/res for the
 * features these handlers use (req.body, req.query, req.method, req.headers,
 * res.status().json(), res.setHeader(), res.end()).
 *
 * This file is ONLY used for local preview — production still runs each handler
 * as an individual Vercel serverless function.
 */
import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";

import cards from "../api/cards";
import login from "../api/login";
import me from "../api/me";
import rates from "../api/rates";
import users from "../api/users";
import countries from "../api/countries";
import cardRates from "../api/card-rates";
import staff from "../api/staff";
import siteImages from "../api/site-images";
import settings from "../api/settings";
import upload from "../api/upload";
import geo from "../api/geo";

const app = express();
app.use(express.json({ limit: "6mb" }));

type Handler = (req: any, res: any) => unknown | Promise<unknown>;

const wrap = (handler: Handler) => (req: Request, res: Response) => {
  Promise.resolve(handler(req, res)).catch((err) => {
    console.error("[devserver]", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error." });
    }
  });
};

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.all("/api/cards", wrap(cards));
app.all("/api/login", wrap(login));
app.all("/api/me", wrap(me));
app.all("/api/rates", wrap(rates));
app.all("/api/users", wrap(users));
app.all("/api/countries", wrap(countries));
app.all("/api/card-rates", wrap(cardRates));
app.all("/api/staff", wrap(staff));
app.all("/api/site-images", wrap(siteImages));
app.all("/api/settings", wrap(settings));
app.all("/api/upload", wrap(upload));
app.all("/api/geo", wrap(geo));

const PORT = Number(process.env.PORT ?? 8001);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[devserver] API listening on http://0.0.0.0:${PORT}`);
});
