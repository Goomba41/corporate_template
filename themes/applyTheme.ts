/**
 * @file applyTheme.ts
 * @description Чистая функция для применения конфигурации темы к документу.
 * 
 * @module themes/applyTheme
 * @category Infrastructure
 * 
 * @remarks
 * - Не содержит реактивности, сайд-эффектов кроме DOM-манипуляций
 * - Легко тестируется: можно мокать document или передавать test root element
 * - Следует принципу Single Responsibility
 * - Безопасна для SSR: проверяет наличие document перед выполнением
 * 
 * @example
 * // Базовое использование
 * applyThemeToDocument({
 *   colorTheme: 'blue',
 *   colorSurface: 'slate', 
 *   displayMode: 'dark',
 *   uiCorner: 0.25
 * })
 * 
 * @example
 * // Тестирование с моком
 * const mockRoot = document.createElement('div')
 * applyThemeToDocument(config, mockRoot)
 * expect(mockRoot.classList.contains('color-blue')).toBe(true)
 */
import type { BasicColorMode } from '@vueuse/core'
import { type ColorTheme, type ColorSurface, type UICorner } from '~/themes/types'
import { colorThemes, colorSurfaces, displayModes } from '~/themes/types'

export interface ThemeConfig {
    colorTheme: ColorTheme
    colorSurface: ColorSurface
    displayMode: BasicColorMode
    uiCorner: UICorner
}

/**
 * Применяет конфигурацию темы к корневому элементу документа.
 * 
 * @param config - Объект с настройками темы
 * @param root - Целевой HTMLElement (по умолчанию document.documentElement)
 * 
 * @sideEffects
 * - Модифицирует classList переданного элемента
 * - Устанавливает CSS-переменную `--ui-radius`
 * 
 * @performance
 * - O(n) по количеству тем для очистки классов (n ~ 30), что приемлемо
 * - Можно оптимизировать через кэширование списков классов, если станет узким местом
 * 
 * @security
 * - Все значения берутся из типизированных enum, инъекция классов невозможна
 */
export const applyThemeToDocument = (
    config: ThemeConfig, 
    root: HTMLElement = document?.documentElement
) => {
    if (typeof document === 'undefined' || root === undefined) return

    // Безопасная очистка: удаляем все возможные классы тем
    root.classList.remove(
        ...colorThemes.map(t => `color-${t}`),
        ...colorSurfaces.map(s => `surface-${s}`),
        ...displayModes.map(m => `mode-${m}`),
        'dark', 'light'
    )

    // Применение актуальных классов
    root.classList.add(
        `color-${config.colorTheme}`,
        `surface-${config.colorSurface}`,
        `mode-${config.displayMode}`
    )

    // CSS-переменная для скруглений
    root.style.setProperty('--ui-radius', `${config.uiCorner}rem`)

    // Интеграция с UnoCSS / Tailwind
    if (config.displayMode === 'dark') {
        root.classList.add('dark')
    }
}