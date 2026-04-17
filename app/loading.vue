<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage>
        <div class="mb-6">
          <USkeleton class="h-4 w-32" />
        </div>

        <div class="flex flex-col gap-4 mt-6">
          <USkeleton class="h-[220px] w-full rounded-lg" />
          <USkeleton class="h-10 w-3/4 mx-auto" />
          <USkeleton class="h-5 w-2/3 mx-auto" />
          <USkeleton class="h-16 w-40 mx-auto rounded-lg" />
        </div>

        <UPageBody class="max-w-3xl mx-auto mt-8">
          <div class="space-y-3">
            <USkeleton class="h-5 w-full" />
            <USkeleton class="h-5 w-11/12" />
            <USkeleton class="h-5 w-10/12" />
            <USkeleton class="h-5 w-full" />
            <USkeleton class="h-5 w-9/12" />
            <USkeleton class="h-5 w-11/12" />
          </div>

          <div class="mt-8 space-y-3">
            <USkeleton class="h-5 w-full" />
            <USkeleton class="h-5 w-10/12" />
            <USkeleton class="h-5 w-full" />
            <USkeleton class="h-5 w-8/12" />
          </div>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
