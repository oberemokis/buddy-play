# Sync — Монорепозиторий

## Стек
- **Фронтенд**: Vue 3 + Pinia + Module Federation (Vite)
- **Бэкенд**: Hono (Node.js)
- **Рантайм**: Effect (`effect`, `@effect/platform`) — используется повсеместно
- **Менеджер пакетов**: pnpm 10 + Turbo

## Архитектура
```
apps/
  api/posts/            ← @sync/posts-api (бэкенд на Hono)   → apps/api/AGENTS.md
  web/
    host/               ← @sync/host (Vite-хост, 5173)      → apps/web/AGENTS.md
    posts/              ← @sync/posts (Vite-ремоут, 5001)
packages/
  api/                  ← @sync/api (HTTP-клиент + Effect)
  config/               ← @sync/config (топология портов/URL, манифест ремоутов)
  schemes/              ← @sync/schemes (Effect Schema)
  stores/               ← @sync/stores (Pinia, синглтон для MFE)
  ui/                   ← @sync/ui (UI-кит — пока пустой)
  utils/                ← @sync/utils (хелпер Module, без зависимостей)
```

У каждого сервиса свой `AGENTS.md` с локальными деталями. OpenCode автоматически подгружает их, поднимаясь от рабочей директории вверх.

## Команды
- `pnpm install` — установить все зависимости
- `pnpm dev` — запустить все приложения (Turbo: host + posts + api параллельно)
- `pnpm dev:web` — только фронтенд (host + posts)
- `pnpm dev:api` — только бэкенд (posts-api)
- `pnpm test` — все юнит-тесты (Turbo, Vitest по пакетам)
- `pnpm test:e2e` — e2e-тесты (Playwright: поднимает host + posts + api)
- `pnpm gen:remotes` — сгенерировать типы ремоутов (`host/src/remotes.d.ts`) из манифеста в `@sync/config`

### Команды по пакетам
- Typecheck бэкенда: `pnpm typecheck` (из `apps/api/posts/`, запускает `tsc --noEmit`)
- Typecheck фронтенда: отдельного скрипта нет — `npx vue-tsc --noEmit` из директории приложения
- Сборка: `pnpm build` из директорий пакетов (api: `tsc`, web: `vite build`)
- Тесты: `pnpm test` в пакете (Vitest) или `pnpm test` из корня (Turbo агрегирует)

### Синтаксис фильтров Turbo
- `turbo run dev --filter './apps/web/*'` — все web-приложения
- `turbo run dev --filter './apps/api/*'` — все api-приложения

## Ключевые паттерны
- **Effect везде**: рантайм, схемы, HTTP-клиенты, слои сервисов — всё на `effect` и `@effect/platform`. Никаких «голых» промисов и try/catch.
- **Пакеты экспортируют исходники напрямую**: все `packages/*` указывают `main`/`types`/`exports` на `./src/index.ts`. Без шага сборки — Vite/tsx резолвят на лету.

Подробные паттерны лежат рядом с кодом:
- Паттерн Effect-слоёв бэкенда → `apps/api/AGENTS.md`
- Настройка Module Federation → `apps/web/AGENTS.md`
- Раскладка сущностей в пакете → `packages/api/AGENTS.md`

## Конвенции
- Правила стиля кода: `.rules` (автоподгрузка через `.opencode/opencode.jsonc` → instructions)
- Покрывают: именование, ранний возврат, вертикальные объекты в return, алиас `@/`, категоризацию компонентов (`elements`/`blocks`/`widgets`)
