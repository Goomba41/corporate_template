// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@primevue/nuxt-module',
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    'nuxt-zod-i18n',
  ],

  vite: {
    server: { allowedHosts: ['borodavkin'] }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'ru', language: 'ru-RU' }
    ],
    defaultLocale: 'ru',
  },

  primevue: {
    options: {
      unstyled: true
    },
    components: {
      prefix: 'Prime', // Префикс для компонентов, чтобы избежать конфликтов
      include: [ // Явно указываем нужные компоненты для оптимизации
        'Button',
      ]
    },
  },

  unocss: {
    icons: true,
    attributify: true,
  },

  css: [
    '@unocss/reset/tailwind.css'
  ],
})