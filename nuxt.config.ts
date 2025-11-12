export default defineNuxtConfig({
  app: {
    baseURL: "/",
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "motion-v/nuxt",
  ],

  image: {
    provider: "none", // no IPX runtime, no provider needed
    quality: 80,
    format: ["webp", "png", "jpeg"],
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2024-11-01",

  nitro: {
    preset: "github-pages",
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
    static: true,
  },
  router: {
    options: {
      strict: true,
    },
    trailingSlash: false,
  },

  routeRules: {
    "/**": { prerender: true },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
