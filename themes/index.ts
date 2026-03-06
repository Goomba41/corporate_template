import { blueBrand } from './brand/blue'
import { greenBrand } from './brand/green'
import { purpleBrand } from './brand/purple'

import { lightMode } from './modes/light'
import { darkMode } from './modes/dark'

import type {
    ThemeConfig,
    ColorTheme,
    DisplayMode,
    CombinedTheme
} from './types'

// Создаем комбинированные темы
export const themes: Record<ColorTheme, Record<DisplayMode, ThemeConfig>> = {
    blue: {
        light: {
            name: 'blue-light',
            label: 'Blue (Light)',
            brand: blueBrand,
            mode: lightMode,
            variables: {
                '--primary-50': blueBrand.primary[50],
                '--primary-500': blueBrand.primary[500],
                '--primary-600': blueBrand.primary[600],
                '--bg-primary': lightMode.background.primary,
                '--bg-secondary': lightMode.background.secondary,
                '--text-primary': lightMode.text.primary,
                '--text-secondary': lightMode.text.secondary,
                '--border-primary': lightMode.border.primary
            }
        },
        dark: {
            name: 'blue-dark',
            label: 'Blue (Dark)',
            brand: blueBrand,
            mode: darkMode,
            variables: {
                '--primary-50': blueBrand.primary[50],
                '--primary-500': blueBrand.primary[500],
                '--primary-600': blueBrand.primary[600],
                '--bg-primary': darkMode.background.primary,
                '--bg-secondary': darkMode.background.secondary,
                '--text-primary': darkMode.text.primary,
                '--text-secondary': darkMode.text.secondary,
                '--border-primary': darkMode.border.primary
            }
        }
    },
    green: {
        light: {
            name: 'green-light',
            label: 'Green (Light)',
            brand: greenBrand,
            mode: lightMode,
            variables: {
                '--primary-50': greenBrand.primary[50],
                '--primary-500': greenBrand.primary[500],
                '--primary-600': greenBrand.primary[600],
                '--bg-primary': lightMode.background.primary,
                '--bg-secondary': lightMode.background.secondary,
                '--text-primary': lightMode.text.primary,
                '--text-secondary': lightMode.text.secondary,
                '--border-primary': lightMode.border.primary
            }
        },
        dark: {
            name: 'green-dark',
            label: 'Green (Dark)',
            brand: greenBrand,
            mode: darkMode,
            variables: {
                '--primary-50': greenBrand.primary[50],
                '--primary-500': greenBrand.primary[500],
                '--primary-600': greenBrand.primary[600],
                '--bg-primary': darkMode.background.primary,
                '--bg-secondary': darkMode.background.secondary,
                '--text-primary': darkMode.text.primary,
                '--text-secondary': darkMode.text.secondary,
                '--border-primary': darkMode.border.primary
            }
        }
    },
    purple: {
        light: {
            name: 'purple-light',
            label: 'Purple (Light)',
            brand: purpleBrand,
            mode: lightMode,
            variables: {
                '--primary-50': purpleBrand.primary[50],
                '--primary-500': purpleBrand.primary[500],
                '--primary-600': purpleBrand.primary[600],
                '--bg-primary': lightMode.background.primary,
                '--bg-secondary': lightMode.background.secondary,
                '--text-primary': lightMode.text.primary,
                '--text-secondary': lightMode.text.secondary,
                '--border-primary': lightMode.border.primary
            }
        },
        dark: {
            name: 'purple-dark',
            label: 'Purple (Dark)',
            brand: purpleBrand,
            mode: darkMode,
            variables: {
                '--primary-50': purpleBrand.primary[50],
                '--primary-500': purpleBrand.primary[500],
                '--primary-600': purpleBrand.primary[600],
                '--bg-primary': darkMode.background.primary,
                '--bg-secondary': darkMode.background.secondary,
                '--text-primary': darkMode.text.primary,
                '--text-secondary': darkMode.text.secondary,
                '--border-primary': darkMode.border.primary
            }
        }
    }
}

// Получение темы по комбинированному имени
export const getTheme = (color: ColorTheme, mode: DisplayMode): ThemeConfig => {
    return themes[color][mode]
}

// Все доступные комбинации
export const getAllThemes = (): ThemeConfig[] => {
    const result: ThemeConfig[] = []
    Object.values(themes).forEach(modes => {
        Object.values(modes).forEach(theme => result.push(theme))
    })
    return result
}