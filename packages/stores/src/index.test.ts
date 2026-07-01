import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUiStore } from "./index";

describe("useUiStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with no user selected", () => {
    const store = useUiStore();

    expect(store.selectedUserId).toBeNull();
  });

  it("selects a user", () => {
    const store = useUiStore();

    store.selectUser(5);

    expect(store.selectedUserId).toBe(5);
  });

  it("clears the selection when passed null", () => {
    const store = useUiStore();
    store.selectUser(5);

    store.selectUser(null);

    expect(store.selectedUserId).toBeNull();
  });
});
