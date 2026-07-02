import { createApp } from "vue";
import { createPinia } from "pinia";
import { middleware } from "@buddy-play/middleware";
import { navigationLogger } from "@/middleware/logger";
import { dashboardGuard } from "@/guard/dashboard";
import { router } from "@/router";
import App from "./App.vue";

middleware(router, {
  global: [navigationLogger],
  routes: {
    "/dashboard": [dashboardGuard],
  },
});

createApp(App).use(createPinia()).use(router).mount("#app");
