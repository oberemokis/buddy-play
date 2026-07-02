import type { Middleware } from "@buddy-play/middleware";

/**
 * Логирует каждый навигационный переход: откуда → куда.
 * Используется как пример глобального middleware.
 */
export const navigationLogger: Middleware = ({ to, from }) => {
  console.log(`[router] ${from.fullPath} → ${to.fullPath}`);
};
