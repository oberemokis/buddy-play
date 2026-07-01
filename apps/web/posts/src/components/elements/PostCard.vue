<script lang="ts" setup>
import Skeleton from "boneyard-js/vue";
import type { Post } from "@sync/schemes";

defineProps<{ post: Post; loading: boolean }>();
</script>

<template>
  <Skeleton name="post-card" :loading="loading">
    <article class="card">
      <h3>{{ post.title }}</h3>
      <p>{{ post.body }}</p>
    </article>
  </Skeleton>
</template>

<style scoped>
.card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  text-transform: capitalize;
}

.card p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}
</style>
