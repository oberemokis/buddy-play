import { computed, ref } from "vue";
import { Effect, ManagedRuntime } from "effect";
import { FetchHttpClient } from "@effect/platform";
import { useUiStore } from "@buddy-play/stores";
import { fetchPosts } from "@buddy-play/api";
import type { Post } from "@buddy-play/schemes";

type Status = "idle" | "loading" | "loaded" | "error";

type StateMap<T> = {
  idle: {
    status: "idle";
  };
  loading: {
    status: "loading";
  };
  loaded: {
    status: "loaded";
    data: T;
  };
  error: {
    status: "error";
    error: string;
  };
};

type State<T> = StateMap<T>[Status];

const runtime = ManagedRuntime.make(FetchHttpClient.layer);

const loaded = (data: ReadonlyArray<Post>): State<Post[]> => ({
  status: "loaded",
  data: [...data],
});

const failed = (error: { message: string }): State<Post[]> => ({
  status: "error",
  error: error.message,
});

function filterPostsByUser(posts: Post[], userId: number): Post[] {
  return posts.filter((post) => post.userId === userId);
}

export function usePosts() {
  const state = ref<State<Post[]>>({ status: "idle" });
  const uiStore = useUiStore();

  async function load(): Promise<void> {
    state.value = { status: "loading" };

    const program = Effect.match(fetchPosts, {
      onSuccess: loaded,
      onFailure: failed,
    });

    state.value = await runtime.runPromise(program);
  }

  const filteredPosts = computed<Post[]>(() => {
    if (state.value.status !== "loaded") {
      return [];
    }

    if (uiStore.selectedUserId === null) {
      return state.value.data;
    }

    return filterPostsByUser(state.value.data, uiStore.selectedUserId);
  });

  load();

  return {
    state,
    filteredPosts,
    uiStore,
    load,
  };
}
