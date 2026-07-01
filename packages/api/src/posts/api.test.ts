import { describe, expect, it } from "vitest";
import { HttpClient, HttpClientResponse } from "@effect/platform";
import { Effect, Exit } from "effect";
import { fetchPostById, fetchPosts } from "./api";

const posts = [
  { userId: 1, id: 1, title: "First", body: "Body one" },
  { userId: 2, id: 2, title: "Second", body: "Body two" },
];

/** Создаёт HttpClient, который отвечает на каждый запрос заданным JSON-телом и статусом. */
function stubClient(body: unknown, status = 200) {
  return HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify(body), {
          status,
          headers: { "content-type": "application/json" },
        }),
      ),
    ),
  );
}

const run = <A, E>(effect: Effect.Effect<A, E, HttpClient.HttpClient>, client: HttpClient.HttpClient) =>
  Effect.runPromiseExit(effect.pipe(Effect.provideService(HttpClient.HttpClient, client)));

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
