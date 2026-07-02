# @buddy-play/host

Shell на Module Federation. Потребляет ремоуты, владеет Pinia и роутингом.

- **Порт**: 5173
- **Роль**: хост — нет `exposes`, только `remotes`

## Роутинг

Файловый роутинг через `unplugin-vue-router`. Страницы лежат в `src/pages/`, роутер генерируется автоматически.

```
src/
  pages/
    index.vue         ← /
    about.vue         ← /about
  typed-router.d.ts   ← автогенерируется
```

## Middleware

Глобальные и per-route middleware через `@buddy-play/middleware`. Регистрируются в `main.ts`:

```ts
middleware(router, { global: [navigationLogger] });
```

Сами middleware лежат в `src/middleware/`. Контекст: `{ to, from, router }`.

## Реестр ремоутов (`vite.config.ts`)

Карта `remotes` НЕ пишется руками — она выводится из манифеста ремоутов в `@buddy-play/config` через `toRemotes()`. URL каждого ремоута можно переопределить переменной окружения `VITE_REMOTE_<NAME>_URL`.

## Shared-синглтоны

```ts
shared: {
  vue:            { singleton: true },
  "vue-router":   { singleton: true },
  "@buddy-play/stores": { singleton: true, requiredVersion: "*" },
  pinia:          { singleton: true },
}
```

## Правила

- Pinia создаётся здесь (`createPinia()` в `main.ts`) — это тот синглтон, который MF разделяет со всеми ремоутами.
- Алиас импорта `@/` → `./src` (через `resolve.alias` в `vite.config.ts`).
- Никаких `defineAsyncComponent` для ремоутов на страницах — только внутри `<Suspense>` на конкретных страницах.
