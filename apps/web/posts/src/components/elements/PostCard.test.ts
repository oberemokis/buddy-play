import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PostCard from "./PostCard.vue";

// Обёртка skeleton — это сторонняя зависимость, рендерим только её слот по умолчанию.
vi.mock("boneyard-js/vue", () => ({
  default: { name: "Skeleton", template: "<div><slot /></div>" },
}));

const post = { userId: 1, id: 1, title: "A title", body: "Some body text" };

describe("PostCard", () => {
  it("renders the post title and body", () => {
    const wrapper = mount(PostCard, { props: { post, loading: false } });

    expect(wrapper.find("h3").text()).toBe("A title");
    expect(wrapper.find("p").text()).toBe("Some body text");
  });
});
