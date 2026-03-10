
import { ref, watch, onMounted } from 'vue'
import {
    type ColorTheme,
    type DisplayMode,
} from '~/themes/types'
import { useCookie } from '#app'
import { usePreferredColorScheme } from '@vueuse/core'

export const useTheme = () => {
    const colorThemeCookie = useCookie<ColorTheme>('theme-color', {
        default: () => 'blue'
    })

    const displayModeCookie = useCookie<DisplayMode>('theme-mode', {
        default: () => 'no-preference'
    })

    // Определяем предпочитаемый режим системы
    const preferredColorScheme = usePreferredColorScheme()

    // Цветовая тема (бренд)
    const colorTheme = ref<ColorTheme>(colorThemeCookie.value)

    // Режим отображения (светлый/темный)
    const displayMode = ref<DisplayMode>((() => {
        if (displayModeCookie.value === 'no-preference' || !displayModeCookie.value) {
            return preferredColorScheme.value as DisplayMode
        }
        return displayModeCookie.value
    })())

    // Изменение цветовой темы
    const setColorTheme = (color: ColorTheme) => {
        colorTheme.value = color
        colorThemeCookie.value = color
        applyTheme()
    }

    // Изменение режима отображения
    const setDisplayMode = (mode: DisplayMode) => {
        displayMode.value = mode
        displayModeCookie.value = mode
        applyTheme()
    }

    // Переключение режима
    const toggleDisplayMode = () => {
        const newMode: DisplayMode = displayMode.value === 'light' ? 'dark' : 'light'
        setDisplayMode(newMode)
    }

    // Переключение цветовой темы
    const cycleColorTheme = () => {
        const colors: ColorTheme[] = ['blue', 'green', 'purple']
        const currentIndex = colors.indexOf(colorTheme.value)
        const nextIndex = (currentIndex + 1) % colors.length
        setColorTheme(colors[nextIndex]!)
    }

    // Применение темы
    const applyTheme = () => {
        if (typeof document === 'undefined') return

        const root = document.documentElement

        // Удаляем все классы тем
        root.className = root.className
            .replace(/\btheme-(blue|green|purple|light|dark)\b/g, '')
            .trim()

        // Добавляем классы текущей темы
        root.classList.add(`theme-${colorTheme.value}`)
        root.classList.add(`theme-${displayMode.value}`)

        // Управляем классом 'dark' для UnoCSS
        if (displayMode.value === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }

    // Применяем тему на клиенте
    onMounted(() => {
        applyTheme()
    })

    // Watchers
    // Следим за изменением системного режима
    watch(preferredColorScheme, (newScheme) => {
        if (displayModeCookie.value === 'no-preference') {
            displayMode.value = newScheme as DisplayMode
            applyTheme()
        }
    })

    watch(colorTheme, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            colorThemeCookie.value = newVal
        }
    })

    watch(displayMode, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            displayModeCookie.value = newVal
        }
    })

    return {
        // Состояние
        colorTheme,
        displayMode,

        // Методы
        setColorTheme,
        setDisplayMode,
        toggleDisplayMode,
        cycleColorTheme,
        applyTheme
    }
}