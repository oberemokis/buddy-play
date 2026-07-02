import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import UnpluginVueRouter from "unplugin-vue-router/vite";
import { defineConfig, loadEnv } from "vite";
import { services, toRemotes } from "@buddy-play/config";

// Приложения используют общий .env в корне монорепо (там лежат межсервисные URL).
const envDir = fileURLToPath(new URL("../../../", import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, "VITE_");

  // Значения топологии по умолчанию (localhost); в prod каждая запись переопределяется через
  // VITE_REMOTE_<NAME>_URL — новые ремоуты получают это автоматически.
  const remotes = toRemotes();
  for (const [name, remote] of Object.entries(remotes)) {
    const override = env[`VITE_REMOTE_${name.toUpperCase()}_URL`];
    if (override) remote.entry = `${override}/remoteEntry.js`;
  }

  return {
    envDir,
    plugins: [
      UnpluginVueRouter({
        routesFolder: "src/pages",
        dts: "src/typed-router.d.ts",
      }),
      vue(),
      federation({
        name: "host",
        remotes,
        shared: {
          vue: { singleton: true },
          "vue-router": { singleton: true },
          "@buddy-play/stores": { singleton: true, requiredVersion: "*" },
          pinia: { singleton: true },
        },
        dts: false,
      }),
    ],
    server: {
      port: services.host.port,
      strictPort: true,
    },
    preview: {
      port: services.host.port,
      strictPort: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      target: "esnext",
    },
  };
});
