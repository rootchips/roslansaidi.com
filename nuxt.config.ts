export default defineNuxtConfig({
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
    provider: "ipx",
    format: ["webp", "png", "jpeg"],
    quality: 80,
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2024-11-01",

  nitro: {
    preset: "github-pages",
  },

  routeRules: {
    "/**/": { redirect: { to: (url) => url.slice(0, -1), statusCode: 301 } },
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
