import type { Middleware } from "@sync/middleware";

/**
 * Логирует каждый навигационный переход: откуда → куда.
 * Используется как пример глобального middleware.
 */
export const navigationLogger: Middleware = ({ to, from }) => {
  console.log(`[router] ${from.fullPath} → ${to.fullPath}`);
};
