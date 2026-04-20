/**
 * @file useSurfaceTheme.ts
 * @description Composable для управления цветом фоновых поверхностей.
 * 
 * @module composables/shared/useSurfaceTheme
 * @category Application Layer / Feature
 * 
 * @remarks
 * - Отвечает за вторичную палитру: фоны карточек, панелей, модалок
 * - Архитектурно зеркален useColorTheme для консистентности
 * - Позволяет комбинировать бренд-цвет и поверхность независимо
 * 
 * @design_decision
 * Разделение colorTheme/surfaceTheme позволяет реализовать сложные дизайн-системы,
 * где, например, бренд 'emerald' может сочетаться с поверхностью 'slate' или 'zinc'.
 */

import { ref } from 'vue'
import {
    colorSurfaces,
    colorSurfacesMetadata,
    type ColorSurface,
} from '~/themes/types'
import { useCookie } from '#app'

/**
 * Хук для работы с темой поверхностей.
 * @returns {SurfaceThemeApi} API для управления поверхностями
 */
export const useSurfaceTheme = () => {
    // Цвет поверхности
    const colorSurfaceCookie = useCookie<ColorSurface>('theme-surface', {
        default: () => 'slate'
    })
    const colorSurface = ref<ColorSurface>(colorSurfaceCookie.value)

    /**
     * Возвращает отсортированный список поверхностей.
     * @see useColorTheme.getColorThemes для аналогичной логики
     */
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
    }

    /**
     * 🔄 Циклическое переключение поверхностей.
     * @see cycleColorTheme
     */
    const cycleColorSurface = () => {
        const colors: readonly ColorSurface[] = colorSurfaces
        const currentIndex = colors.indexOf(colorSurface.value)
        const nextIndex = (currentIndex + 1) % colors.length
        setColorSurface(colors[nextIndex]!)
    }

    return {
        // Состояние
        colorSurface: shallowReadonly(colorSurface),

        // Методы
        getColorSurfaces, setColorSurface, cycleColorSurface,
    }
}