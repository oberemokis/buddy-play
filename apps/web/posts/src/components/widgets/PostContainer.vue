<script lang="ts" setup>
import { usePosts } from "@/composables/usePosts";
import "@/bones/registry";
import PostList from "@/components/blocks/PostList.vue";

const { state, filteredPosts, uiStore, load } = usePosts();
</script>

<template>
  <button :disabled="state.status === 'loading'" @click="load()">Reload</button>

  <p v-if="state.status === 'error'" class="error">
    {{ state.error }}
  </p>

  <p v-if="uiStore.selectedUserId !== null" class="filter-note">
    Filtered by user #{{ uiStore.selectedUserId }}
  </p>

  <PostList
    :posts="filteredPosts"
    :is-loading="state.status === 'loading'"
    :selected-user-id="uiStore.selectedUserId"
  />
</template>

<style scoped>
.error {
  color: #d00;
  padding: 8px 0;
}

.filter-note {
  margin: 12px 0 0;
  color: #555;
  font-size: 0.9rem;
}
</style>
