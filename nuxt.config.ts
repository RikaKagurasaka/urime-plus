// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt", "@unocss/nuxt", "@nuxt/eslint"],
  css: ["@unocss/reset/tailwind-compat.css"],
});
