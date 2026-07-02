import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { middleware } from "@sync/middleware";
import { navigationLogger } from "@/middleware/logger";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

middleware(router, {
  global: [navigationLogger],
});

createApp(App).use(createPinia()).use(router).mount("#app");
