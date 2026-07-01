import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PostList from "./PostList.vue";
import PostCard from "@/components/elements/PostCard.vue";

vi.mock("boneyard-js/vue", () => ({
  default: { name: "Skeleton", template: "<div><slot /></div>" },
}));

const posts = [
  { userId: 1, id: 1, title: "One", body: "b1" },
  { userId: 2, id: 2, title: "Two", body: "b2" },
];

describe("PostList", () => {
  it("renders one card per post", () => {
    const wrapper = mount(PostList, {
      props: { posts, isLoading: false, selectedUserId: null },
    });

    expect(wrapper.findAllComponents(PostCard)).toHaveLength(2);
  });

  it("hides the filter note when no user is selected", () => {
    const wrapper = mount(PostList, {
      props: { posts, isLoading: false, selectedUserId: null },
    });

    expect(wrapper.find(".filter-note").exists()).toBe(false);
  });

  it("shows the filter note for the selected user", () => {
    const wrapper = mount(PostList, {
      props: { posts, isLoading: false, selectedUserId: 2 },
    });

    expect(wrapper.find(".filter-note").text()).toContain("#2");
  });

  it("forwards the loading flag to cards", () => {
    const wrapper = mount(PostList, {
      props: { posts, isLoading: true, selectedUserId: null },
    });

    expect(wrapper.findComponent(PostCard).props("loading")).toBe(true);
  });
});
