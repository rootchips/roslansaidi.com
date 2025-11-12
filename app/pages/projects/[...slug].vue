<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
      queryCollection('projects').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
      queryCollectionItemSurroundings('projects', route.path, {
            fields: ['description']
      })
)

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const projectsNavigation = computed(() => navigation.value.find(item => item.path === '/projects')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(projectsNavigation?.value, page.value?.path)).map(({ icon, ...link }) => link))

if (page.value.image) {
      defineOgImage({ url: page.value.image })
} else {
      defineOgImageComponent('Blog', {
            headline: breadcrumb.value.map(item => item.label).join(' > ')
      }, {
            fonts: ['Geist:400', 'Geist:600']
      })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
      title,
      description,
      ogDescription: description,
      ogTitle: title
})

const articleLink = computed(() => `${window?.location}`)

const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
      })
}
</script>

<template>
      <UMain class="mt-20 px-2">
            <UContainer class="relative min-h-screen">
                  <UPage v-if="page">
                        <ULink to="/projects" class="text-sm flex items-center gap-1">
                              <UIcon name="lucide:chevron-left" />
                              Back to projects
                        </ULink>
                        <div class="flex flex-col gap-3 mt-8">
                              <NuxtImg :src="page.image" :alt="page.title"
                                    class="rounded-lg w-full h-[300px] object-cover object-center" />
                              <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
                                    {{ page.title }}
                              </h1>
                              <p class="text-muted text-center max-w-2xl mx-auto">
                                    {{ page.description }}
                              </p>
                        </div>
                        <UPageBody class="max-w-3xl mx-auto">
                              <ContentRenderer v-if="page.body" :value="page" />
                              <ULink v-if="page.url" :to="page.url" class="hover text-sm text-primary flex items-center">
                                    Go to website
                                    <UIcon name="i-lucide-arrow-right"
                                          class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100" />
                              </ULink>

                              <div class="flex items-center justify-end gap-2 text-sm text-muted">
                                    <UButton size="sm" variant="link" color="neutral" label="Copy link"
                                          @click="copyToClipboard(articleLink, 'Article link copied to clipboard')" />
                              </div>
                              <UContentSurround :surround />
                        </UPageBody>
                  </UPage>
            </UContainer>
      </UMain>
</template>
