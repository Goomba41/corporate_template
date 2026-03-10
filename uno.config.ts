import { defineConfig } from 'unocss'

export default defineConfig({
  layers: {
    // Базовые стили (сброс, переменные)
    base: 0,

    // Компоненты библиотек (PrimeVue)
    components: 1,

    // Утилиты UnoCSS (наивысший приоритет)
    utilities: 2
  },

  shortcuts: [
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