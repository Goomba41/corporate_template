
export const colorThemes = [
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'coral',
    'sage'
] as const;
export const colorSurfaces = ['gray', 'neutral', 'ocean', 'slate', 'soho', 'stone', 'viva', 'zinc', 'mauve'] as const
export const displayModes = ['dark', 'light', 'system', 'no-preference'] as const

// NOTE: Использованы цвета 600 веса для предпросмотра тем и поверхностей
export const colorThemesMetadata: Record<ColorTheme, { order: number, preview: string, label: string }> = {
    'amber': { order: 2, label: 'amber', preview: '#d97706' },
    'blue': { order: 10, label: 'blue', preview: '#2563eb' },
    'cyan': { order: 8, label: 'cyan', preview: '#0891b2' },
    'emerald': { order: 6, label: 'emerald', preview: '#059669' },
    'fuchsia': { order: 14, label: 'fuchsia', preview: '#c026d3' },
    'green': { order: 5, label: 'green', preview: '#65a30d' },
    'indigo': { order: 11, label: 'indigo', preview: '#4f46e5' },
    'lime': { order: 4, label: 'lime', preview: '#65a30d' },
    'orange': { order: 1, label: 'orange', preview: '#ea580c' },
    'pink': { order: 15, label: 'pink', preview: '#db2777' },
    'purple': { order: 13, label: 'purple', preview: '#9333ea' },
    'rose': { order: 16, label: 'rose', preview: '#e11d48' },
    'sky': { order: 9, label: 'sky', preview: '#0284c7' },
    'teal': { order: 7, label: 'teal', preview: '#0d9488' },
    'violet': { order: 12, label: 'violet', preview: '#7c3aed' },
    'yellow': { order: 3, label: 'yellow', preview: '#ca8a04' },
    'coral': { order: 17, label: 'coral', preview: '#D05A40' },
    'sage': { order: 18, label: 'sage', preview: '#4A6B40' }
}

export const colorSurfacesMetadata: Record<ColorSurface, { order: number, preview: string, label: string }> = {
    'gray': { order: 2, label: 'gray', preview: '#4b5563' },
    'neutral': { order: 4, label: 'neutral', preview: '#525252' },
    'ocean': { order: 6, label: 'ocean', preview: '#5f7274' },
    'slate': { order: 1, label: 'slate', preview: '#475569' },
    'soho': { order: 7, label: 'soho', preview: '#6a6b70' },
    'stone': { order: 5, label: 'stone', preview: '#57534e' },
    'viva': { order: 8, label: 'viva', preview: '#6e7173' },
    'zinc': { order: 3, label: 'zinc', preview: '#52525b' },
    'mauve': { order: 9, label: 'mauve', preview: '#594c5b' },
}

export type ColorTheme = typeof colorThemes[number];
export type ColorSurface = typeof colorSurfaces[number]
export type DisplayMode = 'dark' | 'light' | 'system' | 'no-preference'