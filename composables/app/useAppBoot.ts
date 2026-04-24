export type BootStage =
    | 'init'
    | 'theme-loading'
    | 'theme-ready'
    | 'cache-warmup'
    | 'ready'

const DEV_STAGE_DELAY_MS = import.meta.dev ? 500 : 0

export function useAppBoot() {
    const stage = useState<BootStage>('boot:stage', () => 'init')
    const progress = useState<number>('boot:progress', () => 0)
    const hasBooted = useState<boolean>('boot:has-booted', () => false)

    const isThemeReady = ref(false)
    const errors = ref<string[]>([])

    const { t } = useI18n()
    const i18nPath = 'system.boot'

    const isHydrationComplete = ref(import.meta.server)

    // Карта весов для прогресса (сумма = 100)
    const STAGE_WEIGHTS: Record<BootStage, number> = {
        init: 0,
        'theme-loading': 15,
        'theme-ready': 40,
        'cache-warmup': 80,
        ready: 100
    }

    const setStage = (newStage: BootStage) => {
        stage.value = newStage
        progress.value = STAGE_WEIGHTS[newStage]
    }

    const devDelay = async () => {
        if (DEV_STAGE_DELAY_MS > 0) 
            await new Promise(resolve => setTimeout(resolve, DEV_STAGE_DELAY_MS))
    }

    // Основная инициализация
    const boot = async () => {
        if (hasBooted.value) {
            return { success: true as const }
        }

        try {
            if (isHydrationComplete.value) {
                setStage('theme-loading')
                setStage('theme-ready')
                return { success: true as const }
            }

            if (!isHydrationComplete.value) {
                isHydrationComplete.value = true
            }

            setStage('theme-loading')
            await devDelay()

            useTheme()

            if (document.documentElement.getAttribute('data-theme-applied') === 'true') {
                isThemeReady.value = true
            } else {
                // 3. Иначе ждём событие от applyThemeToDocument
                isThemeReady.value = await new Promise<boolean>((resolve) => {
                    const handler = () => {
                        document.removeEventListener('theme-applied', handler as EventListener)
                        resolve(true)
                    }
                    document.addEventListener('theme-applied', handler as EventListener)

                    // Fallback таймаут на случай, если событие не сработает
                    setTimeout(() => {
                        document.removeEventListener('theme-applied', handler as EventListener)
                        console.warn(t(`${i18nPath}.themeTimeout`))
                        resolve(true) // Не блокируем приложение
                    }, 2000)
                })
            }

            setStage('theme-ready')
            await devDelay()

            // 2. (Опционально) Предварительная загрузка критичных данных для оффлайна
            if (import.meta.client && navigator.onLine) {
                setStage('cache-warmup')
                await devDelay()
                // TODO: когда будем делать кэширование, предварительная загрузка критичных данных
                // await useCacheWarmer().prefetchCriticalData().catch(e => {
                //   // Не блокируем загрузку при ошибке кэша
                //   console.warn(t(`${i18nPath}.cacheError`), e)
                //   errors.value.push('Не удалось подготовить оффлайн-режим')
                // })
            }

            await devDelay()
            setStage('ready')
            hasBooted.value = true
            return { success: true as const }
        } catch (err) {
            errors.value.push(err instanceof Error ? err.message : 'Unknown boot error')
            setStage('ready')
            hasBooted.value = true
            return { success: false as const, error: err }
        }
    }

    return {
        stage,
        progress,
        errors,
        hasBooted,
        isReady: computed(() => stage.value === 'ready'),
        boot,
        setStage
    }
}