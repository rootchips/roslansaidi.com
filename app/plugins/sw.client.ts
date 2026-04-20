export default defineNuxtPlugin(() => {
  if (import.meta.dev) {
    return
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }
})
