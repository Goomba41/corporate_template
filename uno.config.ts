import { defineConfig } from 'unocss'

export default defineConfig({
  layers: {
    // Базовые стили (сброс, переменные)
    base: 0,

    // Компоненты библиотек (PrimeVue)
    components: 1,

    // СЛОЙ 1: Базовые варианты кнопок (цвета)
    'btn-base': 2,

    // СЛОЙ 2: Модификаторы кнопок (outlined, text) - ВЫШЕ приоритет!
    'btn-modifiers': 3,

    // Размеры (не конфликтуют)
    'btn-sizes': 4,

    // Утилиты UnoCSS (наивысший приоритет)
    utilities: 5
  },

  shortcuts: [
    // Базовые классы для кнопок
    ['btn', 'rounded-lg font-medium inline-flex items-center justify-center gap-2 border', {
      layer: 'btn-base'
    }],

    // Варианты кнопок
    ['btn-primary', 'bg-primary-600 text-secondary-100 border-primary-600 hover:bg-primary-700 hover:border-primary-700', {
      layer: 'btn-base'
    }],
    ['btn-secondary', 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 hover:border-secondary-300', {
      layer: 'btn-base'
    }],

    ['btn-success', 'bg-success text-white border-success', {
      layer: 'btn-base'
    }],
    ['btn-danger', 'bg-error text-white border-error', {
      layer: 'btn-base'
    }],
    ['btn-info', 'bg-info text-white border-info', {
      layer: 'btn-base'
    }],
    ['btn-warning', 'bg-warning text-white border-warning', {
      layer: 'btn-base'
    }],
    ['btn-help', 'bg-help text-white border-help', {
      layer: 'btn-base'
    }],

    // Размеры кнопок
    ['btn-sm', 'text-sm px-2.5 py-1.5 leading-[normal]', {
      layer: 'btn-sizes'
    }],
    ['btn-md', 'text-base px-3 py-2 leading-[normal]', {
      layer: 'btn-sizes'
    }],
    ['btn-lg', 'text-lg px-3.5 py-2.5 leading-[normal]', {
      layer: 'btn-sizes'
    }],

    // Специальные варианты
    ['btn-outlined', 'bg-transparent', {
      layer: 'btn-modifiers'
    }],
    ['btn-text', 'border-transparent bg-transparent', {
      layer: 'btn-modifiers'
    }],

    // Утилиты
    ['flex-center', 'flex items-center justify-center', { layer: 'utilities' }],
    ['flex-between', 'flex items-center justify-between', { layer: 'utilities' }],
    ['flex-col-center', 'flex flex-col items-center justify-center', { layer: 'utilities' }],
  ],

  theme: {
    colors: {
      primary: {
        50: 'var(--primary-50, #f0f9ff)',
        100: 'var(--primary-100, #e0f2fe)',
        200: 'var(--primary-200, #bae6fd)',
        300: 'var(--primary-300, #7dd3fc)',
        400: 'var(--primary-400, #38bdf8)',
        500: 'var(--primary-500, #0ea5e9)',
        600: 'var(--primary-600, #0284c7)',
        700: 'var(--primary-700, #0369a1)',
        800: 'var(--primary-800, #075985)',
        900: 'var(--primary-900, #0c4a6e)'
      },

      secondary: {
        50: 'var(--secondary-50, #f9fafb)',
        100: 'var(--secondary-100, #f3f4f6)',
        200: 'var(--secondary-200, #e5e7eb)',
        300: 'var(--secondary-300, #d1d5db)',
        400: 'var(--secondary-400, #9ca3af)',
        500: 'var(--secondary-500, #6b7280)',
        600: 'var(--secondary-600, #4b5563)',
        700: 'var(--secondary-700, #374151)',
        800: 'var(--secondary-800, #1f2937)',
        900: 'var(--secondary-900, #111827)'
      },

      success: 'var(--accent-success, var(--default-accent-success))',
      warning: 'var(--accent-warning, var(--default-accent-warning))',
      error: 'var(--accent-error, var(--default-accent-error))',
      info: 'var(--accent-info, var(--default-accent-info))',
      help: 'var(--accent-help, var(--default-accent-help)7)'
    }
  },
})