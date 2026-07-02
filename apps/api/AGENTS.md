# apps/api — HTTP-бэкенд (микросервисы)

Каждый API-сервис — это Hono-приложение `@buddy-play/<name>-api`, обёрнутое в Effect-слой.

## Раскладка файлов (на сервис, `src/`)

```
index.ts       ← бутстрап: serve(app.fetch, port)
app.ts         ← Hono-приложение: middleware + подключение роутов
routes.ts      ← Hono-роуты → SomeService.method()
paths.ts       ← константы путей
runtime.ts     ← ManagedRuntime + адаптер respond()
service.ts     ← Effect.Service (бизнес-логика)
repository.ts  ← Effect.Service (доступ к данным)
errors.ts      ← классы Data.TaggedError
```

## Поток Effect-слоёв

1. `repository.ts` — доступ к данным через `Effect.Service` (`sync:` для чистых, `effect:` для I/O).
2. `service.ts` — бизнес-логика, объявляет `dependencies: [Repository.Default]`, использует `accessors: true`.
3. `routes.ts` — маппинг HTTP: `.get(path, ctx => respond(ctx, Service.method()))`.
4. `runtime.ts` — `ManagedRuntime.make(Service.Default)` + `respond()`, который маппит ошибки через `Effect.catchTag(Tag, handler)` в HTTP-статусы.

## Правила

- Ошибки — подклассы `Data.TaggedError`. Обрабатываются через `Effect.catchTag("Tag", ...)`.
- Никаких `throw`. Никаких `try/catch`. Только Effect.
- Порт — через `process.env.PORT ?? <default>` (читается `Effect.Config`, запасное значение `3001`).
- Порядок middleware в `app.ts`: `logger()` → `cors()` → роуты.
- Типы данных приходят из `@buddy-play/schemes` — никогда не переопределять локально.

## Добавление нового API-микросервиса

1. `mkdir apps/api/<name>` + `package.json` (по образцу `posts/`).
2. Скопировать раскладку `src/` из 8 файлов выше.
3. `pnpm-workspace.yaml` уже покрывает `apps/api/*` глобом — править не нужно.
4. Фильтры dev/build в Turbo подхватят его автоматически.
