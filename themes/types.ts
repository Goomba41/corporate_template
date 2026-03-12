
export const colorThemes = [
    'amber',
    'blue',
    'cyan',
    'emerald',
    'fuchsia',
    'green',
    'indigo',
    'lime',
    'orange',
    'pink',
    'purple',
    'rose',
    'sky',
    'teal',
    'violet',
    'yellow',
] as const;
export const colorSurface = ['gray', 'neutral', 'ocean', 'slate', 'soho', 'stone', 'viva', 'ocean']

export type ColorTheme = typeof colorThemes[number];
export type ColorSurface = typeof colorSurface[number]
export type DisplayMode = 'dark' | 'light' | 'no-preference'