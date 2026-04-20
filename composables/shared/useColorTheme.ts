
/**
 * @file useColorTheme.ts
 * @description Composable для управления бренд-цветовой темой.
 * 
 * @module composables/shared/useColorTheme
 * @category Application Layer / Feature
 * 
 * @remarks
 * - Управляет одним аспектом: выбор цвета бренда (primary palette)
 * - Сохраняет предпочтение в cookie для оффлайн-режима
 * - Предоставляет утилиты для получения списка и циклического переключения
 * 
 * @persistence Cookie 'theme-color' с дефолтом 'blue'
 */

import { ref } from 'vue'
import {
    colorThemes,
    colorThemesMetadata,
    type ColorTheme,
} from '~/themes/types'
import { useCookie } from '#app'

/**
 * Хук для работы с цветовой темой бренда.
 * 
 * @returns {ColorThemeApi} API для управления цветовой темой
 * 
 * @example
 * const { colorTheme, setColorTheme } = useColorTheme()
 * setColorTheme('emerald')
 */
export const useColorTheme = () => {
    /**
     * 🔐 Cookie-хранилище: синхронизируется между сервером и клиентом в Nuxt.
     * @default 'blue' — безопасный выбор с хорошей контрастностью
     */
    const colorThemeCookie = useCookie<ColorTheme>('theme-color', {
        default: () => 'blue'
    })
    /** Реактивная ссылка на текущую тему (readonly) */
    const colorTheme = ref<ColorTheme>(colorThemeCookie.value)

    /**
     * Возвращает список тем, отсортированный по порядку отображения.
     * 
     * @returns Массив объектов с ключом и метаданными для рендеринга в UI
     * 
     * @note Использует Object.entries + sort для контроля порядка,
     * так как порядок ключей в объекте не гарантирован в старых окружениях.
     */
    const getColorThemes = () => Object.entries(colorThemesMetadata)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([key, value]) => ({
            key: key as ColorTheme,
            ...value
        }))

    /**
     * Устанавливает новую цветовую тему.
     * 
     * @param color - Валидное значение из ColorTheme union type
     * 
     * @sideEffects
     * - Обновляет реактивное состояние
     * - Записывает значение в cookie (автосохранение для оффлайн-режима)
     */
    const setColorTheme = (color: ColorTheme) => {
        colorTheme.value = color
        colorThemeCookie.value = color
    }

    /**
     * 🔄 Циклически переключает тему на следующую в списке.
     * 
     * @example 'blue' → 'indigo' → 'violet' → ... → 'orange' → 'blue'
     * 
     * @note Использует non-null assertion (!) так как массив colorThemes
     * гарантированно содержит текущее значение (по построению).
     */
    const cycleColorTheme = () => {
        const colors: readonly ColorTheme[] = colorThemes
        const currentIndex = colors.indexOf(colorTheme.value)
        const nextIndex = (currentIndex + 1) % colors.length
        setColorTheme(colors[nextIndex]!)
    }

    return {
        // Состояние
        colorTheme: shallowReadonly(colorTheme),

        // Методы
        getColorThemes, setColorTheme, cycleColorTheme,
    }
}