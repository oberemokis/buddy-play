<script lang="ts" setup>
</script>

<template>
  <header>
    <h1>Sync</h1>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
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

nav {
  display: flex;
  gap: 16px;
}

nav a {
  color: #333;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

nav .router-link-active {
  font-weight: 600;
}
</style>
