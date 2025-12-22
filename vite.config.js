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
  // 👇 FORCE load env from project root
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(),tailwindcss(),],
    define: {
      __VITE_ENV_DEBUG__: JSON.stringify(env),
    },
  };
});
