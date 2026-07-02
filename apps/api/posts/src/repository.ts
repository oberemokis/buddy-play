import { Effect, Option } from "effect";
import type { Post } from "@buddy-play/schemes";

const seed: ReadonlyArray<Post> = [
  { userId: 1, id: 1, title: "First post", body: "Hello from the Hono API." },
  { userId: 1, id: 2, title: "Second post", body: "Shared types keep this in sync with the frontend." },
];

export class PostsRepository extends Effect.Service<PostsRepository>()(
  "PostsRepository",
  {
    sync: () => {
      const posts = [...seed];

      return {
        findAll: () => Effect.succeed(posts),
        findById: (id: number) =>
          Effect.succeed(Option.fromNullable(posts.find((post) => post.id === id))),
      };
    },
  },
) {}
