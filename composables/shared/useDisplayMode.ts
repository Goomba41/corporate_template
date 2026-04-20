/**
 * @file useDisplayMode.ts
 * @description Composable для управления светлым/тёмным режимом с поддержкой системных предпочтений.
 * 
 * @module composables/shared/useDisplayMode
 * @category Application Layer / Feature
 * 
 * @remarks
 * - Использует @vueuse/core useColorMode для сложной логики синхронизации
 * - Абстрагирует разницу между внутренним 'auto' и публичным 'system'
 * - Предоставляет resolvedMode — окончательное значение для применения к документу
 * 
 * @complexity
 * Это самый сложный composable модуля из-за:
 * 1. Трёхсторонней синхронизации: cookie ↔ @vueuse ↔ системные предпочтения
 * 2. Адаптации типов: DisplayMode (публичный) ↔ BasicColorMode + 'auto' (внутренний)
 * 3. SSR-совместимости через кастомное хранилище на базе cookies
 * 
 * @testing
 * Рекомендуется моковать usePreferredColorScheme и useCookie при юнит-тестах.
 */

import {
    displayModes,
    type DisplayMode,
} from '~/themes/types'
import { useCookie } from '#app'
import { useColorMode, usePreferredColorScheme, type BasicColorMode, type StorageLike } from '@vueuse/core'

/**
 * Создаёт адаптер для использования cookies в качестве хранилища для @vueuse/core.
 * 
 * @param cookieName - Имя cookie для сохранения предпочтения
 * @param defaultValue - Значение по умолчанию
 * @returns {StorageLike} Объект, совместимый с интерфейсом Storage для useColorMode
 * 
 * @architecture
 * Паттерн Adapter: преобразует Nuxt useCookie API к интерфейсу, ожидаемому @vueuse.
 * Это позволяет использовать преимущества обоих библиотек без дублирования состояния.
 */
const createCookieStorage = (cookieName: string, defaultValue: BasicColorMode | 'auto') => {
    const cookieRef = useCookie<BasicColorMode | 'auto' | null>(cookieName, {
        default: () => defaultValue
    })

    return {
        // 📥 Чтение: null если значение не установлено (совместимо с Storage API)
        getItem: (): string | null => cookieRef.value ?? null,
        // 📤 Запись: преобразуем string обратно в типизированное значение
        setItem: (_key: string, value: string) => {
            cookieRef.value = value as BasicColorMode | 'auto'
        },
        // 🗑️ Удаление: сброс к null
        removeItem: (_key: string) => {
            cookieRef.value = null
        }
    } satisfies StorageLike
}

/**
 * Хук для управления режимом отображения (светлый/тёмный).
 * 
 * @returns {DisplayModeApi} API для работы с цветовым режимом
 * 
 * @example
 * const { displayMode, resolvedMode, setDisplayMode } = useDisplayMode()
 * 
 * // displayMode.value === 'system' → пользователь хочет следовать системе
 * // resolvedMode.value === 'dark' → фактический режим для применения
 */
export const useDisplayMode = () => {

    /**
     * 🔧 useColorMode из @vueuse — мощная утилита, но требует адаптации:
     * - Поддерживает 'auto' для отслеживания системных предпочтений
     * - Требует StorageLike интерфейс (адаптируем через createCookieStorage)
     * - emitAuto: true сохраняет 'auto' в состояние, а не разрешает его
     */
    const colorMode = useColorMode<BasicColorMode | 'auto'>({
        modes: { auto: 'system' },
        storageKey: 'theme-mode',
        storage: createCookieStorage('theme-mode', 'auto'),
        emitAuto: true,
        initialValue: 'auto'
    })

    const preferredColorScheme = usePreferredColorScheme()

    /**
     * 🔄 Двустороннее вычисляемое свойство:
     * - GET: преобразует внутреннее 'auto' в публичное 'system' для отображения в UI
     * - SET: преобразует публичное 'system' обратно во внутреннее 'auto' для useColorMode
     * 
     * @note Это критически важно для разделения "что выбрал пользователь" и "что использует система"
     */
    const displayMode = computed({
        get: () => colorMode.value === 'auto' ? 'system' : colorMode.value,
        set: (mode: DisplayMode) => {
            colorMode.value = mode === 'system' ? 'auto' : mode
        }
    })

    const getDisplayModes = () => displayModes

    // Изменение режима отображения
    const setDisplayMode = (mode: DisplayMode) => {
        displayMode.value = mode
    }

    /**
     * 🔄 Циклическое переключение режимов.
     * Порядок: light → dark → system → light
     */
    const cycleDisplayMode = () => {
        const modes: readonly DisplayMode[] = displayModes
        const currentIndex = modes.indexOf(displayMode.value)
        const nextIndex = (currentIndex + 1) % modes.length
        setDisplayMode(modes[nextIndex]!)
    }

    /**
     * 🎯 Вычисляет фактический режим для применения к документу.
     * 
     * @returns {'light' | 'dark'} Гарантированное значение без 'auto'/'system'
     * 
     * @logic
     * - Если пользователь выбрал 'auto': используем системные предпочтения
     * - Если система не определила предпочтение ('no-preference'): фоллбэк на 'light'
     * - Иначе: используем явный выбор пользователя
     * 
     * @warning preferredColorScheme работает только на клиенте!
     * На сервере всегда возвращает 'no-preference', поэтому resolvedMode
     * должен вычисляться отдельно в app.vue для SSR.
     */
    const resolvedMode = computed(() => {
        if (colorMode.value === 'auto') {
            // Если система не определила предпочтение — фоллбэк на light
            return preferredColorScheme.value === 'no-preference'
                ? 'light'
                : preferredColorScheme.value
        }
        return colorMode.value
    })

    return {
        // Состояние
        displayMode,
        resolvedMode,

        // Методы
        getDisplayModes, setDisplayMode, cycleDisplayMode,
    }
}