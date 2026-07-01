import { beforeEach, describe, expect, it, vi } from "vitest";
import { Effect } from "effect";
import { createPinia, setActivePinia } from "pinia";
import { useUiStore } from "@sync/stores";

const posts = [
  { userId: 1, id: 1, title: "One", body: "b1" },
  { userId: 2, id: 2, title: "Two", body: "b2" },
  { userId: 1, id: 3, title: "Three", body: "b3" },
];

// Заменяем реальный effect с HTTP на управляемый для каждого теста.
// Holder создаётся до импортов; его effect присваивается в beforeEach.
const fetchPostsMock = vi.hoisted(() => ({ value: undefined as unknown }));

vi.mock("@sync/api", () => ({
  get fetchPosts() {
    return fetchPostsMock.value;
  },
  fetchPostById: vi.fn(),
}));

import { usePosts } from "./usePosts";

describe("usePosts", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    fetchPostsMock.value = Effect.succeed(posts);
  });

  it("loads posts into a 'loaded' state", async () => {
    const { state, load } = usePosts();

    await load();

    expect(state.value.status).toBe("loaded");
    if (state.value.status === "loaded") {
      expect(state.value.data).toHaveLength(3);
    }
  });

  it("returns all posts when no user is selected", async () => {
    const { filteredPosts, load } = usePosts();

    await load();

    expect(filteredPosts.value).toHaveLength(3);
  });

  it("filters posts by the selected user", async () => {
    const { filteredPosts, load } = usePosts();
    await load();

    useUiStore().selectUser(1);

    expect(filteredPosts.value.map((post) => post.id)).toEqual([1, 3]);
  });

  it("captures the error message on failure", async () => {
    fetchPostsMock.value = Effect.fail({ message: "boom" });
    const { state, filteredPosts, load } = usePosts();

    await load();

    expect(state.value).toEqual({ status: "error", error: "boom" });
    expect(filteredPosts.value).toEqual([]);
  });
});
