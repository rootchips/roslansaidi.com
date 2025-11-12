<script setup lang="ts">
import { useRoute } from '#app'
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
      links: NavigationMenuItem[]
}>()

const route = useRoute()

const isActive = (to?: string) => {
      if (!to) return false
      const normalize = (p: string) => p.replace(/\/+$/, '') || '/'
      const current = normalize(route.path)
      const target = normalize(to)

      if (target === '/' && current.startsWith('/articles')) return true

      return current === target || current.startsWith(`${target}/`)
}
</script>

<template>
      <div class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10">
            <UNavigationMenu :items="props.links" variant="link" color="neutral"
                  class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
                  :ui="{
                        link: 'px-2 py-1',
                        linkLeadingIcon: 'hidden'
                  }">
                  <template #item="{ item }">
                        <NuxtLink :to="item.to" class="flex items-center gap-1 px-2 py-1 rounded-full transition-colors"
                              :class="[
                                    isActive(item.to)
                                          ? 'bg-transparent ring-1 text-neutral-700 dark:text-neutral-300'
                                          : 'hover:bg-muted text-neutral-700 dark:text-neutral-300'
                              ]">
                              <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
                              <span>{{ item.label }}</span>
                        </NuxtLink>
                  </template>

                  <template #list-trailing>
                        <ColorModeButton />
                  </template>
            </UNavigationMenu>
      </div>
</template>