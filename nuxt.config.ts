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

  css: ["~/assets/css/main.css"],

  image: {
    provider: "none",
    quality: 80,
    format: ["webp", "png", "jpeg"],
  },

  compatibilityDate: "2024-11-01",

  nitro: {
    preset: "github-pages",
    static: true,
    serveStatic: true,
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
    output: {
      dir: ".output",
      fallback: "404.html",
      structure: "flat",
    },
  },

  vite: {
    publicDir: "public",
    server: {
      fs: { allow: ["public"] },
    },
  },

  router: {
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
