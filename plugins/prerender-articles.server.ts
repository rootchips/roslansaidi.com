export default defineNitroPlugin(async (nitroApp) => {
  const { serverQueryContent } = await import('#content/server-utils')

  const articles = await serverQueryContent('article').find()

  nitroApp.hooks.hook('prerender:routes', (routes: string[]) => {
    for (const article of articles) {
      if (!routes.includes(article._path)) {
        routes.push(article._path)
      }
    }
  })
})