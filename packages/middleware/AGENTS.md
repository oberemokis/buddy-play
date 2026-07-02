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

## Guard

Фабрика `guard(redirectTo, condition)` декомпозирует охранную логику:

```ts
import { guard, middleware } from "@sync/middleware";

const authGuard = guard("/login", (ctx) => !isAuthenticated());
const adminGuard = guard("/403", (ctx) => hasRole(ctx, "admin"));

middleware(router, { global: [authGuard] });
```

- `redirectTo` — статическая строка/объект или `(ctx) => RouteLocationRaw` для динамического редиректа
- `condition` — `(ctx) => boolean`: `true` = проходим, `false` = редиректим на `redirectTo`
