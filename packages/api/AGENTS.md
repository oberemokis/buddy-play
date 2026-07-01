# @sync/api — слой HTTP-клиента

HTTP-клиент на базе Effect для микросервисов API.

## Раскладка сущностей

```
src/
  index.ts                ← re-exports from entities
  <entity>/
    api.ts                ← pure HTTP calls (HttpClient + Schema)
    index.ts              ← re-export from api.ts
```

Текущие сущности: `posts` (`fetchPosts`, `fetchPostById`).

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

- Ответы декодируются через `Schema` — источник истины `@sync/schemes`.
- HTTP-клиент разрешается из контекста; приложение-потребитель предоставляет `FetchHttpClient.layer` (см. `apps/web/posts/src/composables/usePosts.ts`).
- `BASE_URL` берётся из `@sync/config/client` (`clientConfig.apiUrl`), который читает `import.meta.env.VITE_API_URL` (валидируется через Effect Schema) с запасным localhost-значением из топологии `@sync/config`.

## Расхождение с `.rules`

`.rules` описывает более полную структуру сущности:

```
<entity>/
  api.ts      ← HTTP calls (ky)               ← actual: @effect/platform, not ky
  queries.ts  ← useQuery hooks                ← not implemented
  keys.ts     ← typed query keys              ← not implemented
  index.ts    ← factory via createModule      ← actual: plain re-export
```

`ky` объявлен в зависимостях, но не используется. `createModule` (из `@sync/utils`) тоже не используется. Либо заполните недостающие файлы и перейдите на ky, либо обновите `.rules`, когда направление устоится.
