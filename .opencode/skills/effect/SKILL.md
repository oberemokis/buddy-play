---
name: effect
description: Effect-TS — сервисы, схемы, слои, тесты
---

# Effect-TS

## Структура сервисов

Сервисы — классы, расширяющие `Effect.Service<Имя>()` с двумя аргументами: строка-имя и объект конфигурации.

У всех сервисов всегда `accessors: true` — это даёт статические методы для вызова (например, `UserService.findById()`, а не `yield* service.findById()`).

Сервисы с зависимостями используют `effect: Effect.gen(...)` — внутри через `yield*` получают зависимости и возвращают объект с методами. Зависимости перечисляются явно в поле `dependencies` — никакого скрытого provisioning.

Синхронные сервисы без зависимостей (in-memory репозитории, хелперы) используют `sync: () => ({ ... })`, где методы сразу возвращают `Effect.succeed` или `Option.fromNullable`.

## Типизированные ошибки

Ошибки — классы, расширяющие `Data.TaggedError("ИмяОшибки")` с дженериком-объектом полей (все поля — `readonly`). Каждый домен ошибки — отдельный класс.

Обработка: `Effect.catchTag("ИмяОшибки", ...)`. В тестах — `Cause.failureOption(exit.cause)` с проверкой через `toBeInstanceOf`.

## Схемы данных

Каждая сущность — `Schema.Struct({ ... })` с явными примитивами (`Schema.Number`, `Schema.String` и т.д.). Рядом экспортируется тип через `Schema.Schema.Type<typeof Схема>`. Для массивов — `Schema.Array`, для nullable — `Schema.optional`.

Никакой runtime-валидации вне Effect Schema. Zod и подобные не используются.

## HTTP-клиент

Используется `@effect/platform` (`HttpClient`, `HttpClientResponse`). Паттерн: общая функция для запросов с декодированием через `schemaBodyJson(schema)`, обёрнутая в `Effect.scoped`. Каждый эндпоинт — именованный экспорт из общей функции + URL и схемы.

## Рантайм

Бэкенд: один `ManagedRuntime` на приложение из слоя сервиса. Единая точка входа принимает HTTP-контекст и Effect, запускает через `runPromise`, маппит `catchTag` на коды ответа.

Фронтенд: `ManagedRuntime` из `FetchHttpClient.layer` — создаётся один раз и переиспользуется.

## HTTP-обработчики

Маршруты без логики — каждый вызывает единую точку входа с контекстом и сервисным методом. Никакого парсинга, валидации или бизнес-логики в обработчиках — только передача из HTTP в сервис и обратно.

## Тестирование

`Effect.runPromiseExit(effect.pipe(Effect.provide(Слой)))` — резолвит Effect в `Exit`. Проверки: `Exit.isSuccess` / `Exit.isFailure`, для ошибок — `Cause.failureOption` + `toBeInstanceOf(КлассОшибки)`.

## Конвенции

- Всегда `accessors: true` — вызов методов через `ServiceName.method()`, не через `yield*`
- Один сервис или сущность на файл, barrel-реэкспорт через `index.ts`
- Зависимости всегда явные в `dependencies` — никаких скрытых слоёв
- Ошибки только через типизированные `Data.TaggedError`, без голых `Error` и строк
- Никаких `any`, `as`, non-null assertions в Effect-коде
