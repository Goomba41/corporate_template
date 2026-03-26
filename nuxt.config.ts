// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@unocss/nuxt',
    '@nuxt/test-utils/module',
    'nuxt-zod-i18n',
    'nuxt-svgo',
  ],

  components: {
    dirs: [
      // Путь по умолчанию
      {
        path: '~/components',
        pathPrefix: false, // Не добавлять префикс пути к имени
      },
      { path: '~/components/shared/ui/atoms', prefix: 'Atom' },
      { path: '~/components/shared/ui/molecules', prefix: 'Molecule' },
      { path: '~/components/shared/ui/organisms', prefix: 'Organism' },
    ],
  },

  imports: {
    autoImport: true,
    imports: [
      // Например, функции из VueUse
      // { from: 'vueuse/core', imports: ['useFetch'] },
    ],
    dirs: [
      'composables/shared',
      'composables/features',
      'composables/app'
    ],
  },

  app: {
    head: {
      title: 'Hidden Hippo',
      link: [{ rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
    }
  },

  svgo: {
    dts: true,
    defaultImport: 'component',
    componentPrefix: 'Icon',
    svgoConfig: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            }
          }
        }
      ],
    },
  },

  vite: {
    server: { allowedHosts: ['borodavkin'] }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'ru',
    strategy: 'no_prefix'
  },

  primevue: {
    options: {
      unstyled: true
    },
    components: {
      prefix: 'Prime', // Префикс для компонентов, чтобы избежать конфликтов
      include: [ // Явно указываем нужные компоненты для оптимизации
      ]
    },
  },

  unocss: {
    preflight: true,
    icons: true,
    typography: true,
  },

  css: [
    '~/assets/css/global.css',
    '~/themes/themes.css'  // Импортируем главный файл тем
  ],
})