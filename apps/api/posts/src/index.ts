import { Config, Effect } from "effect";
import { serve } from "@hono/node-server";
import { createApp } from "./app";

const app = createApp();

// PORT инжектится платформой в prod; значение по умолчанию повторяет порт api в
// топологии @buddy-play/config. Читается через Effect.Config, чтобы нечисловое значение падало сразу.
const port = Effect.runSync(Config.number("PORT").pipe(Config.withDefault(3001)));

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[@buddy-play/posts-api] listening on http://localhost:${info.port}`);
});

export type { AppType } from "./app";
