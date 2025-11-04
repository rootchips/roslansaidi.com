export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://avatars.githubusercontent.com/u/13043860?v=4',
      light: 'https://avatars.githubusercontent.com/u/13043860?v=4',
      alt: 'Roslan Saidi'
    },
    meetingLink: 'https://cal.com/',
    email: 'mohamadroslansaidi@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `© 2024 Roslan Saidi`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-x',
      'to': 'https://www.x.com/rootchps',
      'target': '_blank',
      'aria-label': 'X'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://www.github.com/rootchips',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  }
})
