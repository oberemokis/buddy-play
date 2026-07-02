import type { Post } from "@buddy-play/schemes";

/** Статический набор постов для юнит-тестов. */
export const posts: readonly Post[] = [
  { userId: 1, id: 1, title: "First", body: "Body one" },
  { userId: 2, id: 2, title: "Second", body: "Body two" },
];
