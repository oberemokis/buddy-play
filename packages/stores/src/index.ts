import { ref } from "vue";
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", () => {
  const selectedUserId = ref<number | null>(null);

  function selectUser(userId: number | null): void {
    selectedUserId.value = userId;
  }

  return {
    selectedUserId,
    selectUser,
  };
});
