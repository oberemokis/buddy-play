# @sync/api — слой HTTP-клиента

HTTP-клиент на базе `@effect/platform`.

## Раскладка сущностей

```
src/
  index.ts                ← реэкспорт из всех сущностей
  <entity>/
    api.ts                ← HTTP-запросы (HttpClient + Schema)
    index.ts              ← реэкспорт из api.ts
```

## Паттерн HTTP

```ts
import { HttpClient, HttpClientResponse } from "@effect/platform";
import { Effect, Schema } from "effect";

function getJson<A, I>(url: string, schema: Schema.Schema<A, I>) {
  return HttpClient.HttpClient.pipe(
    Effect.flatMap((client) => client.get(url)),
    Effect.flatMap(HttpClientResponse.schemaBodyJson(schema)),
    Effect.scoped,
  );
}
```

## Правила

- Ответы декодируются через `Schema` из `@sync/schemes` — единственный источник истины для моделей данных.
- HTTP-клиент разрешается из контекста Effect. Потребитель обязан предоставить `FetchHttpClient.layer` при запуске рантайма.
- `BASE_URL` берётся из `@sync/config/client` (`clientConfig.apiUrl`), который читает `VITE_API_URL` через Effect Schema с fallback'ом на localhost из топологии сервисов.
- Никаких прямых вызовов `fetch` или сторонних HTTP-библиотек — только `HttpClient` из `@effect/platform`.
