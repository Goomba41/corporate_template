/**
 * @file useUICorner.ts
 * @description Composable для управления радиусом скругления элементов интерфейса.
 * 
 * @module themes/composables/useUICorner
 * @category Application Layer / Feature
 * 
 * @remarks
 * - Управляет CSS-переменной `--ui-radius`, используемой в глобальных стилях
 * - Значения ограничены предопределённым набором (0, 0.25, 0.5 rem)
 * - Простая реализация: один параметр, нет метаданных для сортировки
 * 
 * @accessibility
 * Скругления не должны влиять на фокус-индикаторы и кликабельные области.
 * Убедитесь, что в стилях используется `border-radius: var(--ui-radius)` 
 * только для декоративных элементов.
 */

import { ref } from 'vue'
import {
    uiCorners,
    type UICorner,
} from '~/themes/types'
import { useCookie } from '#app'

/**
 * Хук для управления скруглением интерфейса.
 * @returns {UICornerApi} API для работы с радиусом скругления
 */
export const useUICorner = () => {

    // Радиус скругления
    const uiCornerCookie = useCookie<UICorner>('theme-corner', {
        default: () => 0.25
    })
    const uiCorner = ref<UICorner>(uiCornerCookie.value)

    /**
     * Возвращает массив доступных значений скругления.
     * @note Возвращает readonly массив для предотвращения модификации
     */
    const getUICorners = () => uiCorners
    
    /**
     * Устанавливает новое значение скругления.
     * @param value - Валидное значение из UICorner union type
     */
    const setUICorner = (value: UICorner) => {
        uiCorner.value = value
        uiCornerCookie.value = value
    }

    return {
        // Состояние
        uiCorner: shallowReadonly(uiCorner),

        // Методы
        getUICorners, setUICorner,
    }
}