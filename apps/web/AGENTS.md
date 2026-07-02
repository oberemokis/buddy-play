# apps/web — Микрофронтенды (Module Federation)

Приложения на Vue 3, собираемые через `@module-federation/vite`. Один хост + N ремоутов.

## Порты

`strictPort: true` — dev-режим падает с явной ошибкой, если порт занят.

| App    | Роль    | Порт |
|--------|---------|------|
| host   | shell   | 5173 |
| posts  | remote  | 5001 |

## Общие синглтоны (идентичны во ВСЕХ приложениях)

```ts
shared: {
  vue:            { singleton: true },
  "@buddy-play/stores": { singleton: true, requiredVersion: "*" },
  pinia:          { singleton: true },
}
```

**Никогда** не переопределяйте и не удаляйте записи здесь. Любой ремоут, который создаёт собственный экземпляр Pinia или собственный `@buddy-play/stores`, ломает общее состояние между MFE.

## Правила

- Импортируйте `@buddy-play/stores` напрямую. Никогда не вызывайте `createPinia()` в ремоуте. Никогда не дублируйте определение стора.
- Алиас импорта `@/` → `./src` (согласно `.rules`); никаких относительных `../../`.
- Категоризация компонентов (конвенция проекта): `elements/` → `blocks/` → `widgets/`.
- `dts: false` в конфиге MF — архивы типов MF не создаются. Типы ремоутов лежат в `apps/web/host/src/remotes.d.ts`, который **автогенерируется** скриптом `scripts/gen-remotes.ts` (`pnpm gen:remotes`, привязан к `predev`/`prebuild`) из манифеста в `@buddy-play/config`. Руками файл не редактировать.

## Добавление нового ремоута

1. Создайте `apps/web/<name>/` (по образцу `posts/`).
2. Добавьте запись в манифест ремоутов `packages/config/src/remotes.ts` (`exposes` + порт в топологии сервисов). Vite-конфиги хоста и ремоута берут `remotes`/`exposes` оттуда (`toRemotes()`/`toExposes()`).
3. Запустите `pnpm gen:remotes` — типы в `host/src/remotes.d.ts` сгенерируются сами.
4. Порт должен быть уникальным (иначе `strictPort` упадёт).
