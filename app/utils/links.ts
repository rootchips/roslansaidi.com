import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Articles',
  icon: 'i-lucide-newspaper',
  to: '/'
}, 
{
  label: 'Works',
  icon: 'i-lucide-briefcase-business',
  to: '/works'
}, 
{
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
}]
