import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Japenese Flashcards App",
        short_name: "JFP",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/images/icon-120.png",
            sizes: "120x120",
            type: "image/png",
          },
          {
            src: "/images/icon-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/images/icon-152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/images/icon-167.png",
            sizes: "167x167",
            type: "image/png",
          },
          {
            src: "/images/icon-180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/images/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
