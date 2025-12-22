import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig(({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   base:"/"
// })



export default defineConfig(({ mode }) => {
  // 👇 Force-load env files (.env, .env.production, etc.)
  const env = loadEnv(mode, process.cwd(), "VITE_");

  // 🔎 HARD DEBUG (prints during build)
  console.log("🔥 VITE ENV LOADED:", env);

  return {
    plugins: [react(),tailwindcss()],
    define: {
      __CLOUD_FRONT_URL__: JSON.stringify(
        env.VITE_CLOUD_FRONT_URL
      ),
      __API_BASE_URL__: JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
  };
});
