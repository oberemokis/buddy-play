import { describe, expect, it } from "vitest";
import { Effect, Either, Schema } from "effect";
import { Post } from "./index";

const decode = Schema.decodeUnknownEither(Post);

describe("Post schema", () => {
  it("decodes a well-formed post", () => {
    const result = decode({
      userId: 1,
      id: 42,
      title: "Hello",
      body: "World",
    });

    expect(Either.isRight(result)).toBe(true);
    expect(Either.getOrThrow(result)).toEqual({
      userId: 1,
      id: 42,
      title: "Hello",
      body: "World",
    });
  });

  it("rejects a post with a wrong field type", () => {
    const result = decode({
      userId: "not-a-number",
      id: 42,
      title: "Hello",
      body: "World",
    });

    expect(Either.isLeft(result)).toBe(true);
  });

  it("rejects a post that is missing a field", () => {
    const result = decode({ userId: 1, id: 42, title: "Hello" });

    expect(Either.isLeft(result)).toBe(true);
  });

  it("round-trips through encode/decode", () => {
    const post = { userId: 7, id: 1, title: "T", body: "B" };

    const roundTripped = Effect.runSync(
      Schema.encode(Post)(post).pipe(Effect.flatMap(Schema.decodeUnknown(Post))),
    );

    expect(roundTripped).toEqual(post);
  });
});
