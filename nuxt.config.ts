export default defineNuxtConfig({
  app: {
    router: {
      options: {
        strict: true,
      },
    },
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
