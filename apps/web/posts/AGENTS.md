# @buddy-play/posts

Ремоут на Module Federation. Экспортирует UI списка постов.

- **Порт**: 5001
- **Роль**: ремоут
- **Exposes**: `./PostList → src/components/widgets/PostContainer.vue`

## Skeleton-загрузчик (boneyard-js)

- Vite-плагин: `boneyardPlugin()` в `vite.config.ts`
- Конфиг: `boneyard.config.json` (out dir, анимация, цвета)
- Шаблоны: `src/bones/*.bones.json` (генерируются из разметки компонентов)
- Реестр: `src/bones/registry.ts` — **автогенерируется**, никогда не редактируйте
- Регистрация импортируется ради побочных эффектов в `src/main.ts` (`import "./bones/registry"`)

Сейчас регистрирует `post-card`.

## Поток данных

Композабл `usePosts()` (`src/composables/usePosts.ts`):

- Состояние в виде размеченного объединения: `idle | loading | loaded | error`
- Загружает через `@buddy-play/api` (`fetchPosts`), используя `FetchHttpClient.layer` из `@effect/platform`
- Фильтрует по `useUiStore().selectedUserId` (или возвращает полный список при `null`)
- Автозагрузка при инициализации композабла — ручной запуск не нужен

## Алиас импорта

`@/` → `./src`, обеспечивается в `vite.config.ts`. Никогда не используйте относительные `../../`.
