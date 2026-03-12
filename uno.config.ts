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
        50: 'var(--primary-50, #eff6ff)',
        100: 'var(--primary-100, #dbeafe)',
        200: 'var(--primary-200, #bfdbfe)',
        300: 'var(--primary-300, #93c5fd)',
        400: 'var(--primary-400, #60a5fa)',
        500: 'var(--primary-500, #3b82f6)',
        600: 'var(--primary-600, #2563eb)',
        700: 'var(--primary-700, #1d4ed8)',
        800: 'var(--primary-800, #1e40af)',
        900: 'var(--primary-900, #1e3a8a)',
        950: 'var(--primary-900, #172554)',
      },

      surface: {
        0: 'var(--surface-50, #ffffff)',
        50: 'var(--surface-50, #f9fafb)',
        100: 'var(--surface-100, #f3f4f6)',
        200: 'var(--surface-200, #e5e7eb)',
        300: 'var(--surface-300, #d1d5db)',
        400: 'var(--surface-400, #9ca3af)',
        500: 'var(--surface-500, #6b7280)',
        600: 'var(--surface-600, #4b5563)',
        700: 'var(--surface-700, #374151)',
        800: 'var(--surface-800, #1f2937)',
        900: 'var(--surface-900, #111827)',
        950: 'var(--surface-950, #030712)',
      },

      success: 'var(--accent-success, var(--default-accent-success))',
      warning: 'var(--accent-warning, var(--default-accent-warning))',
      error: 'var(--accent-error, var(--default-accent-error))',
      info: 'var(--accent-info, var(--default-accent-info))',
      help: 'var(--accent-help, var(--default-accent-help)7)'
    }
  },
})