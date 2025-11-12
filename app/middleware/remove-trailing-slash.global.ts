export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== "/" && to.path.endsWith("/")) {
    const newPath = to.path.replace(/\/+$/, "");
    return navigateTo(
      { path: newPath, query: to.query },
      { redirectCode: 301 },
    );
  }
});
