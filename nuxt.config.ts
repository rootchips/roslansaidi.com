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
    "nuxt-studio",
  ],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark"
          },
          langs: [
            "js",
            "javascript",
            "ts",
            "typescript",
            "json",
            "html",
            "css",
            "vue",
            "shell",
            "sh",
            "bash",
            "zsh",
            "yaml",
            "yml",
            "md",
            "mdc",
            "php",
            "python",
            "py",
            "elixir"
          ]
        }
      }
    }
  },
  image: {
    provider: "none",
    quality: 80,
    format: ["webp", "png", "jpeg"],
    static: true,
    staticFilename: "[name]-[width].[ext]",
  },
  css: ["~/assets/css/main.css"],
  experimental: {
    emitRouteChunkError: "automatic-immediate"
  },
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
    "/images/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/_nuxt/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
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