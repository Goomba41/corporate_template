export type BootStage =
    | 'init'
    | 'theme-loading'
    | 'theme-ready'
    | 'cache-warmup'
    | 'ready'

const DEV_STAGE_DELAY_MS = import.meta.dev ? 500 : 0

export function useAppBoot() {
    const stage = ref<BootStage>('init')
    const progress = ref(0)
    const isThemeReady = ref(false)
    const errors = ref<string[]>([])

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
        if (!isHydrationComplete.value) return

        stage.value = newStage
        progress.value = STAGE_WEIGHTS[newStage]
    }

    const devDelay = async (label: string) => {
        if (DEV_STAGE_DELAY_MS > 0) {
            console.debug(`[useAppBoot] ⏱ ${label} — пауза ${DEV_STAGE_DELAY_MS}ms`)
            await new Promise(resolve => setTimeout(resolve, DEV_STAGE_DELAY_MS))
        }
    }

    // Основная инициализация
    const boot = async () => {
        try {
            if (import.meta.server) {
                setStage('theme-loading')
                setStage('theme-ready')
                return { success: true as const }
            }

            setStage('theme-loading')
            await devDelay('theme-loading')

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
                        console.warn('Theme apply timeout')
                        resolve(true) // Не блокируем приложение
                    }, 2000)
                })
            }

            setStage('theme-ready')
            await devDelay('theme-ready')

            // 2. (Опционально) Предзагрузка критичных данных для оффлайна
            if (import.meta.client && navigator.onLine) {
                setStage('cache-warmup')
                await devDelay('cache-warmup')
                // await useCacheWarmer().prefetchCriticalData().catch(e => {
                //   // Не блокируем загрузку при ошибке кэша
                //   console.warn('Cache warmup failed', e)
                //   errors.value.push('Не удалось подготовить оффлайн-режим')
                // })
            }

            await devDelay('ready')
            setStage('ready')
            return { success: true as const }
        } catch (err) {
            errors.value.push(err instanceof Error ? err.message : 'Unknown boot error')
            setStage('ready')
            return { success: false as const, error: err }
        }
    }

    if (!isHydrationComplete.value) {
        onMounted(() => {
            isHydrationComplete.value = true
            // Если boot() уже был вызван, но заблокирован — перезапускаем
            if (stage.value === 'init') {
                boot()
            }
        })
    }

    return {
        stage,
        progress,
        errors,
        isReady: computed(() => stage.value === 'ready'),
        boot,
        setStage
    }
}