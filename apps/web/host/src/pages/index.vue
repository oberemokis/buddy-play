<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const PostList = defineAsyncComponent(() => import("posts/PostList"));
</script>

<template>
  <section>
    <h2>Posts</h2>
    <Suspense>
      <PostList />
      <template #fallback>
        <p>Loading posts...</p>
      </template>
    </Suspense>
  </section>
</template>
