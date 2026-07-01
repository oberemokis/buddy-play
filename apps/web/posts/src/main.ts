import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./bones/registry";

createApp(App).use(createPinia()).mount("#app");
