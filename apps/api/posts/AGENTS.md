# @sync/posts-api

Бэкенд на Hono, отдающий посты. Данные в памяти.

- **Порт**: `3001` (читается через `Effect.Config` из переменной окружения `PORT` с запасным значением `3001`)
- **Base URL**: `http://localhost:3001`
- **Dev**: `pnpm dev` (tsx watch)
- **Typecheck**: `pnpm typecheck`

## Эндпоинты

| Method | Path         | Возвращает                  |
|--------|--------------|-----------------------------|
| GET    | `/health`    | `{ status: "ok" }`          |
| GET    | `/posts`     | `Post[]`                    |
| GET    | `/posts/:id` | `Post` или 404 `PostNotFound`|

Пути объявлены как константы в `src/paths.ts`.

## Данные

Seed (начальные данные) находятся в `repository.ts` как `ReadonlyArray<Post>` (сейчас 2 поста). Персистентности нет — перезапуск стирает любые изменения, сделанные во время работы.

## Ошибки

- `PostNotFound({ id })` → 404 `{ error: "Post <id> not found" }`

## Схемы

`Post` импортируется из `@sync/schemes`. Никогда не переобъявляйте его здесь.
