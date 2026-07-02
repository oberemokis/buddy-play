import { guard } from "@sync/middleware";

/**
 * Блокирует доступ к странице dashboard.
 * Всегда возвращает false — страница защищена, вход запрещён.
 */
export const dashboardGuard = guard(false, () => {
  console.log("[guard] страница защищена — доступ запрещён");
  return false;
});
