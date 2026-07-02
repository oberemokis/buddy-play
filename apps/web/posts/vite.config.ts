import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import { boneyardPlugin } from "boneyard-js/vite";
import { services, toExposes } from "@buddy-play/config";

// Используем общий .env в корне монорепо, чтобы клиентский код подхватывал VITE_API_URL.
const envDir = fileURLToPath(new URL("../../../", import.meta.url));

export default defineConfig({
  envDir,
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  plugins: [
    vue(),
    boneyardPlugin(),
    federation({
      name: "posts",
      filename: "remoteEntry.js",
      exposes: toExposes("posts"),
      shared: {
        vue: {
          singleton: true,
        },
        "@buddy-play/stores": {
          singleton: true,
          requiredVersion: "*",
        },
        pinia: {
          singleton: true,
        },
      },
      dts: false,
    }),
  ],
  server: {
    port: services.posts.port,
    strictPort: true,
  },
  preview: {
    port: services.posts.port,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});
