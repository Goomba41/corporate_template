
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
export const colorSurfaces = ['gray', 'neutral', 'ocean', 'slate', 'soho', 'stone', 'viva', 'zinc']

export type ColorTheme = typeof colorThemes[number];
export type ColorSurface = typeof colorSurfaces[number]
export type DisplayMode = 'dark' | 'light' | 'no-preference'