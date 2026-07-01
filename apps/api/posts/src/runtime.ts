import { Effect, ManagedRuntime } from "effect";
import type { Context } from "hono";
import { PostsService } from "./service";
import { PostNotFound } from "./errors";

const runtime = ManagedRuntime.make(PostsService.Default);

/** Запускает доменный effect и рендерит его как HTTP-ответ, отображая известные ошибки в коды статуса. */
export function respond<A>(
  context: Context,
  effect: Effect.Effect<A, PostNotFound, PostsService>,
): Promise<Response> {
  return runtime.runPromise(
    effect.pipe(
      Effect.map((value) => context.json(value)),
      Effect.catchTag("PostNotFound", (error) =>
        Effect.succeed(context.json({ error: `Post ${error.id} not found` }, 404)),
      ),
    ),
  );
}
