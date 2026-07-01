import { describe, expect, it } from "vitest";
import { createModule } from "./index";

describe("createModule", () => {
  it("merges api, queries and keys into a single module", () => {
    const api = { fetch: () => "data" };
    const queries = { useList: () => [] };
    const keys = { all: ["posts"] };

    const module = createModule(api, queries, keys);

    expect(module.fetch()).toBe("data");
    expect(module.useList()).toEqual([]);
    expect(module.keys).toBe(keys);
  });

  it("lets queries override api members with the same name", () => {
    const api = { value: "from-api" };
    const queries = { value: "from-queries" };

    const module = createModule(api, queries, {});

    expect(module.value).toBe("from-queries");
  });

  it("does not mutate the inputs", () => {
    const api = { a: 1 };
    const queries = { b: 2 };

    createModule(api, queries, {});

    expect(api).toEqual({ a: 1 });
    expect(queries).toEqual({ b: 2 });
  });
});
