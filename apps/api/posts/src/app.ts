import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { postsRoutes } from "./routes";

export function createApp(): Hono {
  const app = new Hono();

  app.use("*", logger());
  app.use("*", cors());

  app.get("/health", (c) => c.json({ status: "ok" }));
  app.route("/", postsRoutes());

  return app;
}

export type AppType = ReturnType<typeof createApp>;
