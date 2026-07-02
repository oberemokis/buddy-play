# @buddy-play/stores — Pinia-сторы (синглтон MFE)

Состояние между MFE через единственный экземпляр Pinia, разделяемый через Module Federation.

## Правила

- **Никогда** не вызывайте `createPinia()` здесь — это задача host-приложения (`apps/web/host/src/main.ts`).
- Только синтаксис Composition API: `defineStore("name", () => {...})`.
- peer-зависимости (`pinia`, `vue`) — предоставляются приложением-потребителем. Никогда не включайте их в бандл.
- Любой стор, определённый здесь, автоматически разделяется между всеми MFE, потому что `@buddy-play/stores` является синглтоном Module Federation.

## Текущие сторы

- `useUiStore` — состояние UI между MFE.
  - `selectedUserId: number | null`
  - `selectUser(userId: number | null): void`

## Добавление стора

1. Создайте `src/<name>-store.ts` с `defineStore(...)`.
2. Реэкспортируйте из `src/index.ts`.
3. Потребители: `import { useXStore } from "@buddy-play/stores"` в любом приложении или remote.
