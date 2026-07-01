<script lang="ts" setup>
import type { Post } from "@sync/schemes";
import PostCard from "@/components/elements/PostCard.vue";

defineProps<{
  posts: Post[];
  isLoading: boolean;
  selectedUserId: number | null;
}>();
</script>

<template>
  <p v-if="selectedUserId !== null" class="filter-note">
    Filtered by user #{{ selectedUserId }}
  </p>

  <div class="grid">
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :loading="isLoading"
    />
  </div>
</template>

<style scoped>
.filter-note {
  margin: 12px 0 0;
  color: #555;
  font-size: 0.9rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 16px 0;
}
</style>
