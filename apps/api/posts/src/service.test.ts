import { describe, expect, it } from "vitest";
import { Cause, Effect, Exit, Option } from "effect";
import { PostsService } from "./service";
import { PostNotFound } from "./errors";

const run = <A, E>(effect: Effect.Effect<A, E, PostsService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(PostsService.Default)));

describe("PostsService", () => {
  it("lists all posts", async () => {
    const exit = await run(PostsService.list());

    expect(Exit.isSuccess(exit)).toBe(true);
    if (Exit.isSuccess(exit)) {
      expect(exit.value).toHaveLength(2);
    }
  });

  it("gets a post by id", async () => {
    const exit = await run(PostsService.getById(2));

    expect(Exit.isSuccess(exit)).toBe(true);
    if (Exit.isSuccess(exit)) {
      expect(exit.value.title).toBe("Second post");
    }
  });

  it("fails with PostNotFound for an unknown id", async () => {
    const exit = await run(PostsService.getById(999));

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      const error = Cause.failureOption(exit.cause);
      expect(Option.getOrNull(error)).toBeInstanceOf(PostNotFound);
    }
  });
});
