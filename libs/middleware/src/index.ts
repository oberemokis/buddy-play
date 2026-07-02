import type {
  Router,
  RouteLocationNormalized,
  RouteLocationRaw,
} from "vue-router";
import type { RouteNamedMap } from "vue-router/auto-routes";

import { match } from "ts-pattern";

/**
 * Контекст, передаваемый в каждую middleware-функцию.
 *
 * @property to — целевой роут, на который происходит переход.
 * @property from — текущий роут, с которого уходит пользователь.
 * @property router — экземпляр Vue Router.
 */
export type MiddlewareContext = {
  readonly to: RouteLocationNormalized;
  readonly from: RouteLocationNormalized;
  readonly router: Router;
};

/**
 * Middleware-функция, выполняемая во время навигации.
 *
 * Может возвращать:
 * - `void` / `Promise<void>` — продолжить навигацию.
 * - `RouteLocationRaw` — перенаправить на указанный роут.
 * - `false` — прервать навигацию.
 */
export type Middleware = (
  context: MiddlewareContext,
) => void | Promise<void> | RouteLocationRaw | false;

/** Псевдоним для глобальных middleware. */
export type MiddlewareOptionGlobal = Middleware;

/**
 * Карта имён роутов → массив middleware для каждого роута.
 * Ключи — имена роутов из `RouteNamedMap`.
 */
export type MiddlewareOptionRoutes = Partial<
  Record<keyof RouteNamedMap, Middleware[]>
>;

/**
 * Опции, принимаемые функцией `middleware()`.
 *
 * @property global — массив middleware, выполняемых при **каждом** переходе.
 * @property routes — карта имя-роута → middleware[] для конкретных роутов.
 */
export type MiddlewareOptions = {
  global?: MiddlewareOptionGlobal[];
  routes?: MiddlewareOptionRoutes;
};

/**
 * Коллекция **глобальных** middleware.
 *
 * Глобальные middleware выполняются при каждой навигации,
 * до любых middleware конкретного роута.
 */
export class GlobalMiddlewareCollection {
  private _middlewares: MiddlewareOptionGlobal[] = [];

  /** Зарегистрировать несколько глобальных middleware за один вызов. */
  addAll(middlewares: MiddlewareOptionGlobal[]): void {
    this._middlewares.push(...middlewares);
  }

  /**
   * Выполнить все зарегистрированные глобальные middleware последовательно.
   * Возвращает первый `RouteLocationRaw` или `false`, полученный от middleware,
   * либо `undefined`, если все middleware пропустили навигацию.
   */
  async runAll(
    context: MiddlewareContext,
  ): Promise<RouteLocationRaw | false | undefined> {
    for (const middleware of this._middlewares) {
      const result = await middleware(context);
      if (result !== undefined) {
        return result;
      }
    }
  }
}

/**
 * Коллекция middleware **конкретных роутов**.
 *
 * Каждый роут может иметь свой массив middleware,
 * индексированный по имени роута из `RouteNamedMap`.
 */
export class RouteMiddlewareCollection {
  private _middlewares = new Map<keyof RouteNamedMap, Middleware[]>();

  /** Назначить массив middleware конкретному роуту. */
  set(route: keyof RouteNamedMap, middlewares: Middleware[]): void {
    this._middlewares.set(route, middlewares);
  }

  /** Получить middleware для роута (пустой массив, если не зарегистрированы). */
  get(route: keyof RouteNamedMap): Middleware[] {
    return this._middlewares.get(route) ?? [];
  }

  /**
   * Выполнить все middleware, зарегистрированные для указанного роута.
   * Возвращает первый `RouteLocationRaw` или `false`, полученный от middleware,
   * либо `undefined`, если все middleware пропустили навигацию.
   */
  async runForRoute(
    route: keyof RouteNamedMap,
    context: MiddlewareContext,
  ): Promise<RouteLocationRaw | false | undefined> {
    const routeMiddlewares = this.get(route);

    for (const middleware of routeMiddlewares) {
      const result = await middleware(context);
      if (result !== undefined) {
        return result;
      }
    }
  }
}

/**
 * Оркестратор выполнения глобальных и per-route middleware.
 *
 * - Глобальные middleware всегда выполняются первыми.
 * - Middleware конкретного роута — вторыми.
 */
export class MiddlewareRunner {
  private readonly _globalMiddlewares: GlobalMiddlewareCollection;
  private readonly _routeMiddlewares: RouteMiddlewareCollection;

  constructor(
    globalMiddlewares: GlobalMiddlewareCollection,
    routeMiddlewares: RouteMiddlewareCollection,
  ) {
    this._globalMiddlewares = globalMiddlewares;
    this._routeMiddlewares = routeMiddlewares;
  }

  /** Зарегистрировать глобальные middleware, выполняемые при каждом переходе. */
  setGlobalAll(middlewares: MiddlewareOptionGlobal[]): void {
    this._globalMiddlewares.addAll(middlewares);
  }

  /** Зарегистрировать middleware для конкретного роута. */
  setRoute(routeName: keyof RouteNamedMap, middlewares: Middleware[]): void {
    this._routeMiddlewares.set(routeName, middlewares);
  }

  /**
   * Выполнить все middleware (глобальные → роут-специфичные) для указанного роута.
   * Возвращает первый `RouteLocationRaw` или `false`, если любой middleware их вернул.
   */
  async run(
    routeName: keyof RouteNamedMap,
    context: MiddlewareContext,
  ): Promise<RouteLocationRaw | false | undefined> {
    const globalResult = await this._globalMiddlewares.runAll(context);
    if (globalResult === false || globalResult !== undefined) {
      return globalResult;
    }

    return this._routeMiddlewares.runForRoute(routeName, context);
  }
}

/**
 * Фабрика guard-функции. Декомпозирует охранную логику на две части:
 * условие (`condition`) и цель редиректа (`redirectTo`).
 *
 * Если `condition` возвращает `false` — навигация перенаправляется на `redirectTo`.
 * Если `true` — навигация продолжается.
 *
 * @param redirectTo — роут для редиректа (строка, объект или функция от контекста)
 * @param condition — предикат: `true` = проходим, `false` = редиректим
 *
 * @example
 * ```ts
 * const authGuard = guard("/login", () => !isAuthenticated());
 *
 * middleware(router, { global: [authGuard] });
 * ```
 */
export function guard(
  redirectTo:
    | RouteLocationRaw
    | false
    | ((ctx: MiddlewareContext) => RouteLocationRaw | false),
  condition: (ctx: MiddlewareContext) => boolean,
): Middleware {
  return (ctx) => {
    if (!condition(ctx)) {
      return typeof redirectTo === "function" ? redirectTo(ctx) : redirectTo;
    }
  };
}

/**
 * Установить поддержку middleware на экземпляр Vue Router.
 *
 * Вызовите после создания роутера, чтобы подключить глобальные
 * и per-route middleware в навигационный хук `beforeEach`.
 *
 * @example
 * ```ts
 * import { createRouter } from "vue-router";
 * import { middleware } from "@buddy-play/middleware";
 *
 * const router = createRouter({ ... });
 *
 * middleware(router, {
 *   global: [authMiddleware],
 *   routes: {
 *     dashboard: [dashboardLoader],
 *   },
 * });
 * ```
 */
export function middleware(router: Router, options: MiddlewareOptions): void {
  const runner = new MiddlewareRunner(
    new GlobalMiddlewareCollection(),
    new RouteMiddlewareCollection(),
  );

  if (options.global) {
    runner.setGlobalAll(options.global);
  }

  if (options.routes) {
    for (const [routeName, middlewares] of Object.entries(options.routes)) {
      if (Array.isArray(middlewares)) {
        runner.setRoute(routeName as keyof RouteNamedMap, middlewares);
      }
    }
  }

  router.beforeEach(async (to, from, next) => {
    if (!to.name) {
      return next();
    }

    const result = await runner.run(to.name as keyof RouteNamedMap, {
      to,
      from,
      router,
    });

    match(result)
      .with(false, () => next(false))
      .when(Boolean, (route: RouteLocationRaw) => next(route))
      .otherwise(() => next());
  });
}
