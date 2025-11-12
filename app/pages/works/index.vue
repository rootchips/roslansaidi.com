<script setup lang="ts">
const { data: page } = await useAsyncData('work-page', () => {
  return queryCollection('pages').path('/works').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: works } = await useAsyncData('works', () =>
  queryCollection('works').order('date', 'DESC').all()
)
if (!works.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'works posts not found',
    fatal: true
  })
}

const { global } = useAppConfig()

useSeoMeta({
      title: 'Works',
      ogTitle: 'Works',
      description: page.value?.seo?.description || page.value?.description,
      ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
      <UPage v-if="page">
            <UPageHero :title="page.title" :description="page.description" :links="page.links" :ui="{
                  title: '!mx-0 text-left',
                  description: '!mx-0 text-left',
                  links: 'justify-start'
            }">
            </UPageHero>
            <UPageSection :ui="{
                  container: '!pt-0'
            }">
                  <Motion v-for="(work, index) in works" :key="work.title"
                        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
                        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :transition="{ delay: 0.2 * index }"
                        :in-view-options="{ once: true }">
                        <UPageCard :title="work.title" :description="work.description" :to="work.path"
                              orientation="horizontal" variant="naked" :reverse="index % 2 === 1" class="group" :ui="{
                                    wrapper: 'max-sm:order-last'
                              }">
                              <template #leading>
                                    <span class="text-sm text-muted">
                                          {{ new Date(work.date).getFullYear() }}
                                    </span>
                              </template>
                              <template #footer>
                                    <ULink :to="work.path" class="hover text-sm text-primary flex items-center">
                                          View Work
                                          <UIcon name="i-lucide-arrow-right"
                                                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100" />
                                    </ULink>
                              </template>
                              <img :src="work.image" :alt="work.title"
                                    class="object-cover w-full h-48 rounded-lg">
                        </UPageCard>
                  </Motion>
            </UPageSection>
      </UPage>
</template>