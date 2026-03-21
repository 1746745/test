import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ローカルサーバーの設定
  server: {
    port: 3000,
    open: true, // ブラウザを自動で開く
  },
  resolve: {
    alias: {
      // エイリアスの設定。exportする際は"@/components/..."などとする
      "@": "/src",
    },
  },
});
