import { describe, expect, it } from "vitest";
import { Effect, Option } from "effect";
import { PostsRepository } from "./repository";

const run = <A, E>(effect: Effect.Effect<A, E, PostsRepository>) =>
  Effect.runPromise(effect.pipe(Effect.provide(PostsRepository.Default)));

describe("PostsRepository", () => {
  it("returns all seeded posts", async () => {
    const posts = await run(
      Effect.flatMap(PostsRepository, (repo) => repo.findAll()),
    );

    expect(posts).toHaveLength(2);
    expect(posts.map((post) => post.id)).toEqual([1, 2]);
  });

  it("finds a post by id", async () => {
    const found = await run(
      Effect.flatMap(PostsRepository, (repo) => repo.findById(1)),
    );

    expect(Option.isSome(found)).toBe(true);
    expect(Option.getOrThrow(found).title).toBe("First post");
  });

  it("returns None for an unknown id", async () => {
    const found = await run(
      Effect.flatMap(PostsRepository, (repo) => repo.findById(999)),
    );

    expect(Option.isNone(found)).toBe(true);
  });
});
