// https://nuxt.com/docs/api/configuration/nuxt-config
const sw = process.env.SW === "true";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vite-pwa/nuxt",
  ],
  css: ["@unocss/reset/tailwind-compat.css"],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "128x128",
          href: "/icon-128.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "512x512",
          href: "/icon-512.png",
        },
      ],
    },
  },
  pwa: {
    strategies: sw ? "injectManifest" : "generateSW",
    srcDir: sw ? "service-worker" : undefined,
    filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    manifest: {
      name: "你才是输入法",
      short_name: "你才是输入法",
      theme_color: "#f3f3f3",
      icons: [
        {
          src: "icon-128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
  },
});
