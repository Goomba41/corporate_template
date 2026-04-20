<script
    setup
    lang="ts"
>
import { computed } from 'vue'
import { usePreferredColorScheme } from '@vueuse/core'

/**
 * @file app.vue
 * @description Точка входа приложения с SSR-безопасной инициализацией темы.
 * 
 * @remarks
 * - Обеспечивает гидратацию темы без FOUC (Flash of Unstyled Content)
 * - Читает предпочтения из cookies (синхронно, работает на сервере)
 * - Учитывает заголовок `sec-ch-prefers-color-scheme` при SSR
 * - Корректирует тему после гидратации, если системные предпочтения изменились
 * 
 * @architecture Clean Architecture — Presentation Layer
 * @concerns SSR, Hydration, Theme Initialization
 */


// === Чтение куки (синхронно, работает и на сервере) ===
/** 
 * NOTE: useCookie из Nuxt автоматически синхронизируется между сервером и клиентом.
 * Значения по умолчанию обеспечивают безопасный фоллбэк при первом посещении.
 */
const themeCookie = useCookie('theme-color', { default: () => 'blue' })
const surfaceCookie = useCookie('theme-surface', { default: () => 'slate' })
const modeCookie = useCookie('theme-mode', { default: () => 'auto' })
const cornerCookie = useCookie('theme-corner', { default: () => 0.25 })

const isServer = import.meta.server

/**
 * Вычисляет начальный режим отображения для серверного рендеринга.
 * 
 * @returns {'light' | 'dark'} Гарантированный режим для SSR
 * 
 * @logic
 * 1. Если пользователь явно выбрал 'light'/'dark' — используем это значение
 * 2. Если 'auto' и мы на сервере:
 *    - Пытаемся прочитать Client Hints заголовок `sec-ch-prefers-color-scheme`
 *    - Фоллбэк на 'light' (более безопасен для читаемости контента)
 * 3. Если 'auto' и мы на клиенте — фоллбэк, будет скорректирован после гидратации
 * 
 * @warning Заголовок `sec-ch-prefers-color-scheme` должен быть разрешён сервером
 * через Permissions-Policy или Accept-CH. Без него возможен временный несоответствие.
 */
const getInitialMode = (): 'light' | 'dark' => {
    if (modeCookie.value && modeCookie.value !== 'auto') {
        return modeCookie.value as 'light' | 'dark'
    }

    if (isServer) {
        const event = useRequestEvent()
        const prefersColorScheme = event?.node.req.headers['sec-ch-prefers-color-scheme'] as string | undefined

        if (prefersColorScheme === 'dark') return 'dark'
        if (prefersColorScheme === 'light') return 'light'

        return 'light'
    }

    return 'light'
}

const initialMode = getInitialMode()

// === Для runtime-обновлений после гидратации ===
/** 
 * NOTE: usePreferredColorScheme работает только на клиенте.
 * На сервере возвращает 'no-preference'.
 */
const preferredColorScheme = usePreferredColorScheme()

/**
 * Реактивное вычисление актуального режима отображения.
 * 
 * @returns {'light' | 'dark'} Режим для применения к <html>
 * 
 * @reactivity
 * - Зависит от modeCookie (изменяется пользователем)
 * - Зависит от preferredColorScheme (изменяется системой, только клиент)
 * - На сервере использует предвычисленное initialMode
 */
const resolvedMode = computed(() => {
    if (modeCookie.value && modeCookie.value !== 'auto') {
        return modeCookie.value as 'light' | 'dark'
    }

    if (!isServer) {
        if (preferredColorScheme.value === 'no-preference') return 'light'
        return preferredColorScheme.value
    }

    return initialMode
})

/**
 * Формирует строку классов для <html> элемента.
 * 
 * @example "color-blue surface-slate mode-dark dark"
 * 
 * @note Класс 'dark' необходим для совместимости с UnoCSS/Tailwind dark mode.
 */
const htmlClass = computed(() => [
    `color-${themeCookie.value}`,
    `surface-${surfaceCookie.value}`,
    `mode-${resolvedMode.value}`,
    resolvedMode.value === 'dark' ? 'dark' : ''
].filter(Boolean).join(' '))

/**
 * Формирует inline-стили для <html> элемента.
 * @example "--ui-radius: 0.25rem"
 */
const htmlStyle = computed(() => `--ui-radius: ${cornerCookie.value}rem`)

/**
 * Корректирует тему после гидратации, если системные предпочтения
 * отличаются от предсказанных на сервере.
 * 
 * @warning Выполняется только если режим установлен в 'auto'.
 * Прямая манипуляция DOM необходима, так как useTheme может ещё не быть инициализирован.
 */
onMounted(() => {
    boot.boot()

    if (modeCookie.value === 'auto' || !modeCookie.value) {
        const systemPrefersDark = preferredColorScheme.value === 'dark'
        const currentIsDark = resolvedMode.value === 'dark'

        // ⚠️ FOUC fix: если сервер "угадал" неверно — немедленно исправляем
        if (systemPrefersDark !== currentIsDark) {
            document.documentElement.classList.toggle('dark', systemPrefersDark)
            document.documentElement.classList.remove('mode-light', 'mode-dark')
            document.documentElement.classList.add(`mode-${systemPrefersDark ? 'dark' : 'light'}`)
        }
    }
})

const i18nPath = 'system.loader.states.'

const { t } = useI18n()

const boot = useAppBoot()

const bootStatusText = computed(() => t(`${i18nPath}${boot.stage.value}`))
</script>

<template>
    <Html
        :class="htmlClass"
        :style="htmlStyle"
    >

    <Body>
        <NuxtLayout>
            <AtomAppPreloader
                :visible="!boot.isReady.value"
                :progress="boot.progress.value"
                :status-text="bootStatusText"
            />
            <!-- @hidden="onPreloaderHidden" -->
            <NuxtPage />
        </NuxtLayout>
    </Body>

    </Html>
</template>