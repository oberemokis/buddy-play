import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import { services, toRemotes } from "@sync/config";

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
      vue(),
      federation({
        name: "host",
        remotes,
        shared: {
          vue: { singleton: true },
          "@sync/stores": { singleton: true, requiredVersion: "*" },
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
    build: {
      target: "esnext",
    },
  };
});
