---
title: "Automatically Logout All Tab Using VueUse Broadcast Channel with Pinia"
description: Keep every tab in sync when a user signs out — one logout closes them all in Nuxt using Broadcast Channel + Pinia.
date: 2024-07-26
image: https://cdn.pixabay.com/photo/2022/10/28/08/11/woman-7552579_960_720.jpg
minRead: 5
author:
  name: Roslan Saidi
  avatar:
    src: https://avatars.githubusercontent.com/u/13043860?v=4
    alt: Roslan Saidi
---

Let's say you encounter a problem where you have opened your application in multiple tabs and when you attempt to log out, only **one tab** gets logged out while the other tabs remain active.

To solve this problem, you can use a **Broadcast Channel**.  
This concept works like a **publish and subscribe** system — one tab publishes an event and all others listen for it.

---

## Install VueUse

First, install [VueUse](https://vueuse.org/):

```bash
npm i @vueuse/core
```

---

## Publish a Logout Message in the Auth Store (Pinia)

In your `auth` store, create a broadcast channel and send a logout signal when the user logs out:

```js
import { useBroadcastChannel } from '@vueuse/core'

const { post } = useBroadcastChannel({ name: 'your-channel' })

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // your data
  }),
  actions: {
    async logout() {
      // refresh token and clear from API

      post('logout')
    }
  },
})
```

---

## Subscribe to the Logout Message in App.vue

Here, we subscribe to a logout message and monitor the data to check whether the published message is received or not.

```js
import { useAuthStore } from '@/stores/auth'
import { useBroadcastChannel } from '@vueuse/core'
import { watch } from 'vue'

const authStore = useAuthStore()

const { data, close } = useBroadcastChannel({ name: 'ibook-channel' })

const logout = async () => {
  try {
    // perform logout logic here if needed
  } catch (e) {
    console.error(e)
  }
}

watch(data, () => {
  if (data.value == 'logout') {
    reloadNuxtApp()
    close()
  }
})
```

---

## Done!

When using this approach, all open tabs that subscribe to the same **broadcast channel** will receive the logout event.  
As a result, when a user logs out in one tab, **all tabs** will log out automatically and refresh.

That’s it!
