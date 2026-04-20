
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
import { useColorMode, usePreferredColorScheme, type BasicColorMode, type StorageLike } from '@vueuse/core'

const createCookieStorage = (cookieName: string, defaultValue: BasicColorMode | 'auto') => {
    const cookieRef = useCookie<BasicColorMode | 'auto' | null>(cookieName, {
        default: () => defaultValue
    })

    return {
        getItem: (): string | null => cookieRef.value ?? null,
        setItem: (_key: string, value: string) => {
            cookieRef.value = value as BasicColorMode | 'auto'
        },
        removeItem: (_key: string) => {
            cookieRef.value = null
        }
    } satisfies StorageLike
}

export const useTheme = () => {
    // Цветовая тема (бренд)
    const colorThemeCookie = useCookie<ColorTheme>('theme-color', {
        default: () => 'blue'
    })
    const colorTheme = ref<ColorTheme>(colorThemeCookie.value)

    // Цвет поверхности
    const colorSurfaceCookie = useCookie<ColorSurface>('theme-surface', {
        default: () => 'slate'
    })
    const colorSurface = ref<ColorSurface>(colorSurfaceCookie.value)

    // Радиус скругления
    const uiCornerCookie = useCookie<UICorner>('theme-corner', {
        default: () => 0.25
    })
    const uiCorner = ref<UICorner>(uiCornerCookie.value)

    // Режим отображения (светлый/темный)
    // Внутреннее состояние
    const colorMode = useColorMode<BasicColorMode | 'auto'>({
        modes: { auto: 'system' },
        storageKey: 'theme-mode',
        storage: createCookieStorage('theme-mode', 'auto'),
        emitAuto: true,
        initialValue: 'auto'
    })

    const preferredColorScheme = usePreferredColorScheme()

    // Внешнее состояние, для UI
    const displayMode = computed({
        get: () => colorMode.value === 'auto' ? 'system' : colorMode.value,
        set: (mode: DisplayMode) => {
            colorMode.value = mode === 'system' ? 'auto' : mode
            applyTheme()
        }
    })

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
    const cycleDisplayMode = () => {
        const modes: readonly DisplayMode[] = displayModes
        const currentIndex = modes.indexOf(displayMode.value)
        const nextIndex = (currentIndex + 1) % modes.length
        setDisplayMode(modes[nextIndex]!)
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

    const resolvedMode = computed(() => {
        if (colorMode.value === 'auto') {
            // Если система не определила предпочтение — фоллбэк на light
            return preferredColorScheme.value === 'no-preference'
                ? 'light'
                : preferredColorScheme.value
        }
        return colorMode.value
    })

    // Применение темы
    const applyTheme = () => {
        if (typeof document === 'undefined') return

        const root = document.documentElement

        // Удаляем все классы тем
        root.classList.remove(
            ...colorThemes.map(t => `color-${t}`),
            ...colorSurfaces.map(s => `surface-${s}`),
            ...displayModes.map(s => `mode-${s}`),
            'dark',
            'light' // для UnoCSS
        )

        // Добавляем классы текущей темы
        root.classList.add(`color-${colorTheme.value}`)
        root.classList.add(`surface-${colorSurface.value}`)
        root.classList.add(`mode-${resolvedMode}`)

        root.style.setProperty('--ui-radius', `${uiCorner.value.toString()}rem`)

        // Управляем классом 'dark' для UnoCSS
        if (resolvedMode.value === 'dark') {
            root.classList.add('dark')
        }
    }

    // Применяем тему на клиенте
    onMounted(() => {
        applyTheme()
    })

    // Watchers
    watch(preferredColorScheme, () => {
        // Переприменяем тему только если активен системный режим
        if (colorMode.value === 'auto') {
            applyTheme()
        }
    }, { immediate: true, flush: 'post' })

    watch(colorTheme, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            colorThemeCookie.value = newVal
        }
    })

    watch(colorSurface, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            colorSurfaceCookie.value = newVal
        }
    })

    watch(uiCorner, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            uiCornerCookie.value = newVal
        }
    })

    return {
        // Состояние
        colorSurface: shallowReadonly(colorSurface),
        colorTheme: shallowReadonly(colorTheme),
        displayMode,
        resolvedMode,
        uiCorner: shallowReadonly(uiCorner),

        // Методы
        getUICorners, setUICorners,
        getColorThemes, setColorTheme, cycleColorTheme,
        getColorSurfaces, setColorSurface, cycleColorSurface,
        getDisplayModes, setDisplayMode, cycleDisplayMode,
        applyTheme
    }
}