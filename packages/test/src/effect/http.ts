import { HttpClient, HttpClientResponse } from "@effect/platform";
import { Effect, Exit } from "effect";

/**
 * Создаёт стаб `HttpClient`, который на любой запрос отвечает заданным
 * JSON-телом и HTTP-статусом. Используется в тестах вместо реального HTTP.
 *
 * @param body — данные, которые будут сериализованы в JSON-ответ
 * @param status — HTTP-статус ответа (по умолчанию 200)
 */
export function stubClient(body: unknown, status = 200): HttpClient.HttpClient {
  return HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify(body), {
          status,
          headers: { "content-type": "application/json" },
        }),
      ),
    ),
  );
}

/**
 * Выполняет Effect, предоставляя в контекст переданный `HttpClient`,
 * и возвращает `Exit` — успех или ошибку. Оборачивает `Effect.runPromiseExit`
 * для единообразного запуска тестируемых эффектов.
 */
export const run = <A, E>(
  effect: Effect.Effect<A, E, HttpClient.HttpClient>,
  client: HttpClient.HttpClient,
): Promise<Exit.Exit<A, E>> =>
  Effect.runPromiseExit(
    effect.pipe(Effect.provideService(HttpClient.HttpClient, client)),
  );
