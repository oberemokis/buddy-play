export type Module<TApi, TQueries, TKeys> = TApi & TQueries & { keys: TKeys };

export function createModule<TApi, TQueries, TKeys>(
  api: TApi,
  queries: TQueries,
  keys: TKeys,
): Module<TApi, TQueries, TKeys> {
  return { ...api, ...queries, keys };
}
