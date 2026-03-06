
export interface BrandColors {
    /** Брендовые цвета (не зависят от режима) */
    primary: {
        50: string
        100: string
        200: string
        300: string
        400: string
        500: string
        600: string
        700: string
        800: string
        900: string
    }
    secondary: {
        50: string
        100: string
        200: string
        300: string
        400: string
        500: string
        600: string
        700: string
        800: string
        900: string
    }
    accent: {
        success: string
        warning: string
        error: string
        info: string
        help: string
    }
}

/** Цвета режима (зависят от light/dark) */
export interface ModeColors {
    background: {
        primary: string    // Основной фон
        secondary: string  // Вторичный фон (карточки, панели)
        tertiary: string   // Третичный фон (модалки, попапы)
    }
    text: {
        primary: string    // Основной текст
        secondary: string  // Вторичный текст
        tertiary: string   // Третичный текст
        inverse: string    // Инвертированный текст
    }
    border: {
        primary: string    // Основная граница
        secondary: string  // Вторичная граница
    }
    shadow: string       // Цвет тени
}

export interface ThemeConfig {
    name: string
    label: string
    brand: BrandColors    // Брендовые цвета
    mode: ModeColors      // Цвета режима
    variables?: Record<string, string>
}

export type ColorTheme = 'blue' | 'green' | 'purple'
export type DisplayMode = 'light' | 'dark'
export type CombinedTheme = `${ColorTheme}-${DisplayMode}`