/**
 * @file useTheme.ts
 * @description Facade-композируемая функция для управления всеми аспектами темы.
 * 
 * @module composables/shared/useTheme
 * @category Application Layer
 * 
 * @remarks
 * - Оркестрирует четыре независимых composable: color, surface, mode, corner
 * - Подписывается на изменения и применяет тему через чистую функцию applyThemeToDocument
 * - Возвращает объединённый API для удобства использования в UI-компонентах
 * 
 * @architecture
 * Использует паттерн Facade для упрощения взаимодействия с подсистемой тем.
 * Каждый аспект темы инкапсулирован в отдельном composable (Single Responsibility).
 * 
 * @example
 * // В компоненте
 * const { colorTheme, setColorTheme, getColorThemes } = useTheme()
 * 
 * @example
 * // В тесте: можно мокать отдельные use* функции
 * vi.mock('~/themes/composables/useColorTheme', () => ({
 *   useColorTheme: () => ({ colorTheme: ref('red'), setColorTheme: vi.fn() })
 * }))
 */
import { applyThemeToDocument } from "~/themes/applyTheme"

/**
 * Главный хук для работы с темой приложения.
 * 
 * @returns {ThemeApi} Объединённый API для чтения и изменения настроек темы
 * 
 * @reactivity
 * Возвращаемые ref являются реактивными: изменения автоматически применяются к документу.
 * 
 * @performance
 * Watcher с `flush: 'post'` гарантирует, что применение темы происходит после обновления DOM,
 * что минимизирует перерисовки.
 */
export const useTheme = () => {
    // 🧩 Инициализация независимых под-композируемых функций
    // Каждая отвечает за свой аспект темы и управляет своим cookie
    const colorTheme = useColorTheme()
    const surfaceTheme = useSurfaceTheme()
    const displayMode = useDisplayMode()
    const uiCorner = useUICorner()

    /**
     * 🔄 Реактивная синхронизация: при изменении ЛЮБОГО параметра темы
     * пересчитываем и применяем полную конфигурацию.
     * 
     * @note Используем массив зависимостей для точного отслеживания.
     * Альтернатива: watch([colorTheme, surfaceTheme, ...], ...) менее типобезопасна.
     */
    watch(
        [
            () => colorTheme.colorTheme.value,
            () => surfaceTheme.colorSurface.value,
            () => displayMode.resolvedMode.value,
            () => uiCorner.uiCorner.value
        ],
        ([ct, cs, dm, uc]) => {
            applyThemeToDocument({
                colorTheme: ct,
                colorSurface: cs,
                displayMode: dm,
                uiCorner: uc
            })
        },
        { 
            flush: 'post', // Применяем после обновления компонентов
            immediate: true // Применяем сразу при монтировании
        }
    )

    return {
        // === Состояние (readonly для внешнего использования) ===
        colorTheme: colorTheme.colorTheme,
        colorSurface: surfaceTheme.colorSurface,
        displayMode: displayMode.displayMode,
        uiCorner: uiCorner.uiCorner,

        // Методы установки
        setColorTheme: colorTheme.setColorTheme,
        setColorSurface: surfaceTheme.setColorSurface,
        setDisplayMode: displayMode.setDisplayMode,
        setUICorner: uiCorner.setUICorner,

        // Списки для UI
        getColorThemes: colorTheme.getColorThemes,
        getColorSurfaces: surfaceTheme.getColorSurfaces,
        getDisplayModes: displayMode.getDisplayModes,
        getUICorners: uiCorner.getUICorners,
    }
}

/** @internal */
export type ThemeApi = ReturnType<typeof useTheme>