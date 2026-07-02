# @buddy-play/schemes — доменные схемы

Определения Effect Schema, общие для бэкенда и фронтенда. Единственный источник истины для форматов данных (по сети).

## Паттерн

```ts
import { Schema } from "effect";

export const Post = Schema.Struct({
  userId: Schema.Number,
  id: Schema.Number,
  title: Schema.String,
  body: Schema.String,
});

export type Post = Schema.Schema.Type<typeof Post>;
```

Экспортируйте **и** схему (значение времени выполнения), **и** тип — с одинаковым именем; TypeScript обрабатывает слияние.

## Правила

- Никогда не используйте `interface` или обычный `type` для форматов данных (по сети) — всегда `Schema.Struct`.
- Схемы здесь зависят только от `effect`. Никаких `@effect/platform`, никаких доменно-специфичных зависимостей.
- Бэкенд декодирует через `HttpClientResponse.schemaBodyJson(SchemaName)`.
- Фронтенд использует ту же схему через `@buddy-play/api` (см. `packages/api/src/posts/api.ts`).

## Добавление схемы

1. `export const X = Schema.Struct({...})`
2. `export type X = Schema.Schema.Type<typeof X>`
3. Реэкспортируйте из `src/index.ts`
