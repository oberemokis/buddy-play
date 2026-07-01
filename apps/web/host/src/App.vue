<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const PostList = defineAsyncComponent(() => import("posts/PostList"));
</script>

<template>
  <header>
    <h1>Sync</h1>
  </header>

  <main>
    <Suspense>
      <PostList />
      <template #fallback>
        <p>Loading...</p>
      </template>
    </Suspense>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #fff;
  color: #333;
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}

header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

header h1 {
  font-size: 1.5rem;
}
</style>
