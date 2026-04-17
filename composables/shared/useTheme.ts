
import { ref, watch, onMounted } from 'vue'
import {
    colorSurfaces,
    colorSurfacesMetadata,
    colorThemes,
    colorThemesMetadata,
    displayModes,
    uiCorners,
    type ColorSurface,
    type ColorTheme,
    type DisplayMode,
    type UICorner,
} from '~/themes/types'
import { useCookie } from '#app'
import { usePreferredColorScheme } from '@vueuse/core'

export const useTheme = () => {
    const colorThemeCookie = useCookie<ColorTheme>('theme-color', {
        default: () => 'blue'
    })

    const colorSurfaceCookie = useCookie<ColorSurface>('theme-surface', {
        default: () => 'slate'
    })

    const displayModeCookie = useCookie<DisplayMode>('theme-mode', {
        default: () => 'no-preference'
    })

    const uiCornerCookie = useCookie<UICorner>('theme-corner', {
        default: () => 0.25
    })

    // Определяем предпочитаемый режим системы
    const preferredColorScheme = usePreferredColorScheme()

    // Цветовая тема (бренд)
    const colorTheme = ref<ColorTheme>(colorThemeCookie.value)

    // TODO: system mode
    // Режим отображения (светлый/темный)
    const displayMode = ref<DisplayMode>((() => {
        if (displayModeCookie.value === 'no-preference' || !displayModeCookie.value) {
            return preferredColorScheme.value as DisplayMode
        }
        return displayModeCookie.value
    })())

    // Цвет поверхности
    const colorSurface = ref<ColorSurface>(colorSurfaceCookie.value)

    const uiCorner = ref<UICorner>(uiCornerCookie.value)

    // Получение списка цветовых тем
    const getColorThemes = () => Object.entries(colorThemesMetadata)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([key, value]) => ({
            key: key as ColorTheme,
            ...value
        }))

    // Изменение цветовой темы
    const setColorTheme = (color: ColorTheme) => {
        colorTheme.value = color
        colorThemeCookie.value = color
        applyTheme()
    }

    const getDisplayModes = () => displayModes

    // Изменение режима отображения
    const setDisplayMode = (mode: DisplayMode) => {
        displayMode.value = mode
        displayModeCookie.value = mode
        applyTheme()
    }

    // Получение списка цветов поверхности
    const getColorSurfaces = () => Object.entries(colorSurfacesMetadata)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([key, value]) => ({
            key: key as ColorSurface,
            ...value
        }))

    // Изменение цвета поверхности
    const setColorSurface = (color: ColorSurface) => {
        colorSurface.value = color
        colorSurfaceCookie.value = color
        applyTheme()
    }

    // Получение списка скруглений
    const getUICorners = () => uiCorners

    const setUICorners = (value: UICorner) => {
        uiCorner.value = value
        uiCornerCookie.value = value
        applyTheme()
    }

    // Переключение режима
    const toggleDisplayMode = () => {
        const newMode: DisplayMode = displayMode.value === 'light' ? 'dark' : 'light'
        setDisplayMode(newMode)
    }

    // Переключение цветовой темы (в цикле)
    const cycleColorTheme = () => {
        const colors: readonly ColorTheme[] = colorThemes
        const currentIndex = colors.indexOf(colorTheme.value)
        const nextIndex = (currentIndex + 1) % colors.length
        setColorTheme(colors[nextIndex]!)
    }

    // Переключение цвета поверхности (в цикле)
    const cycleColorSurface = () => {
        const colors: readonly ColorSurface[] = colorSurfaces
        const currentIndex = colors.indexOf(colorSurface.value)
        const nextIndex = (currentIndex + 1) % colors.length
        setColorSurface(colors[nextIndex]!)
    }

    // Применение темы
    const applyTheme = () => {
        if (typeof document === 'undefined') return

        const root = document.documentElement

        // Удаляем все классы тем
        const themeClassesPattern = [...colorThemes, ...colorSurfaces, 'light', 'dark'].join('|')
        const themeRegex = new RegExp(`\\b(color|mode|surface)-(${themeClassesPattern})\\b`, 'g');
        root.className = root.className
            .replace(themeRegex, '')
            .trim()

        // Добавляем классы текущей темы
        root.classList.add(`color-${colorTheme.value}`)
        root.classList.add(`mode-${displayMode.value}`)
        root.classList.add(`surface-${colorSurface.value}`)

        root.style.setProperty('--ui-radius', `${uiCorner.value.toString()}rem`)

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

    watch(colorSurface, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            colorSurfaceCookie.value = newVal
        }
    })

    return {
        // Состояние
        colorSurface: shallowReadonly(colorSurface),
        colorTheme: shallowReadonly(colorTheme),
        displayMode: shallowReadonly(displayMode),
        uiCorner: shallowReadonly(uiCorner),

        // Методы
        getUICorners,
        setUICorners,
        getColorThemes,
        setColorTheme,
        cycleColorTheme,
        getColorSurfaces,
        setColorSurface,
        cycleColorSurface,
        getDisplayModes,
        setDisplayMode,
        toggleDisplayMode,
        applyTheme
    }
}