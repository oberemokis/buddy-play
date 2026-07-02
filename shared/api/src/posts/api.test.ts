import { describe, expect, it } from "vitest";
import { Exit } from "effect";
import { stubClient, run } from "@buddy-play/test";
import { posts } from "@buddy-play/mocks";
import { fetchPostById, fetchPosts } from "./api";

describe("fetchPosts", () => {
  it("decodes an array of posts", async () => {
    const exit = await run(fetchPosts, stubClient(posts));

    expect(Exit.isSuccess(exit)).toBe(true);
    if (Exit.isSuccess(exit)) {
      expect(exit.value).toEqual(posts);
    }
  });

  it("fails when the payload does not match the schema", async () => {
    const exit = await run(fetchPosts, stubClient([{ id: 1 }]));

    expect(Exit.isFailure(exit)).toBe(true);
  });
});

describe("fetchPostById", () => {
  it("decodes a single post", async () => {
    const exit = await run(fetchPostById(1), stubClient(posts[0]));

    expect(Exit.isSuccess(exit)).toBe(true);
    if (Exit.isSuccess(exit)) {
      expect(exit.value).toEqual(posts[0]);
    }
  });
});
