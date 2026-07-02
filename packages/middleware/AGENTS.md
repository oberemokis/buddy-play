# @sync/middleware — middleware для Vue Router

Система middleware с двухуровневым выполнением: глобальные (на каждый переход) и per-route.

## Структура

```
src/
  index.ts       ← middleware(), MiddlewareRunner, типы
  env.d.ts       ← fallback для RouteNamedMap (unplugin-vue-router)
```

## Паттерн использования

```ts
import { middleware } from "@sync/middleware";

middleware(router, {
  global: [logger, authGuard],
  routes: {
    dashboard: [ensureSubscription],
  },
});
```

- **Глобальные** выполняются на каждый переход, до per-route.
- **Per-route** — только при переходе на указанный роут (ключ — имя роута из `RouteNamedMap`).
- **Последовательное выполнение** с коротким замыканием: первый middleware, вернувший не-`undefined`, останавливает цепочку.
- **Три исхода**: `undefined` = continue, `false` = abort, `RouteLocationRaw` = redirect.
