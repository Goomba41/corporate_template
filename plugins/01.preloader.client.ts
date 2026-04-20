export default defineNuxtPlugin((nuxtApp) => {
    const isClient = import.meta.client

    if (!isClient) return

    // 🎯 Максимально раннее чтение темы из cookies
    const parseThemeCookie = (): Record<string, string> | null => {

        const cookies = document.cookie
            .split('; ')
            .filter(row => row.startsWith('theme-'))


        if (cookies.length === 0) return null

        try {
            const config: Record<string, string> = {}
            for (const cookie of cookies) {
                const [key, value] = cookie.split('=')
                if (key === undefined || value === undefined) continue
                config[key.replace('theme-', '')] = value
            }
            return config
        } catch {
            return null
        }
    }

    const savedTheme = parseThemeCookie()

    if (savedTheme) {
        // Применяем классы СИНХРОННО до любого рендера
        const root = document.documentElement
        
        root.classList.add(
            `color-${savedTheme.color}`,
            `surface-${savedTheme.surface}`,
            `mode-${savedTheme.mode}`
        )

        // 🎯 ВАЖНО: ставим атрибут, чтобы useAppBoot увидел, что тема уже готова
        root.setAttribute('data-theme-applied', 'true')

        // Предзагружаем критичные CSS-файлы (опционально, но рекомендуется)
        void Promise.all([
            import(`@/themes/brands/${savedTheme.color}.css`).catch(() => { }),
            import(`@/themes/modes/${savedTheme.mode}.css`).catch(() => { }),
            import(`@/themes/surfaces/${savedTheme.surface}.css`).catch(() => { })
        ])
    }
})