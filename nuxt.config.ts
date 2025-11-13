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
    "nuxt-gtag",
  ],
  image: {
    provider: "none",
    quality: 80,
    format: ["webp", "png", "jpeg"],
    static: true,
    staticFilename: "[name]-[width].[ext]",
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2024-11-01",
  nitro: {
    preset: "github-pages",
    static: true,
    prerender: {
      crawlLinks: true,
      routes: ["/"],
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
  gtag: {
    id: "G-2S3LXEED4B",
    config: {
      send_page_view: true,
    },
  },
});
