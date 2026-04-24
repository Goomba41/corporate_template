/**
 * @fileoverview Nuxt плагин для диагностики доступности Crypto API в браузере.
 * @description Этот плагин проверяет, работает ли код в безопасном контексте (Secure Context),
 * и доступен ли интерфейс `crypto.subtle`. Это необходимо для функций безопасности,
 * таких как хеширование паролей или проверка утечек данных (pwned matcher).
 * @context Client-side (использует объекты window и location)
 */

export default defineNuxtPlugin((nuxtApp) => {
    // Явная типизация для TS + безопасный фоллбэк
    const i18nInstance = nuxtApp.$i18n as { t: (key: string, params?: Record<string, any>) => string } | undefined
    const t = i18nInstance?.t ?? ((key: string) => key)

    const i18nPath = "system.crypto"

    const { t } = useI18n()
    const i18nPath = "system.crypto"

    /**
     * Выполняет диагностику доступности криптографических API и выводит результат в консоль.
     * Проверяет наличие Secure Context и интерфейса SubtleCrypto.
     *
     * @function debugCryptoAvailability
     * @returns {void}
     * @sideEffects Выводит информацию в console.log и предупреждения в console.warn
     *
     * @description
     * Если `crypto.subtle` недоступен, выводит рекомендации по устранению проблемы:
     * 1. Использование HTTPS.
     * 2. Добавление полифила для SHA-1.
     * 3. Отключение проверки pwned.
     */
    function debugCryptoAvailability() {
        console.log(t(`${i18nPath}.secureContext`, { value: window.isSecureContext }))
        console.log(t(`${i18nPath}.subtle`, { value: !!window.crypto?.subtle }))
        console.log(t(`${i18nPath}.protocol`, { value: location.protocol.replace(':', '') }))
        console.log(t(`${i18nPath}.hostname`, { value: location.hostname }))

        if (!window.crypto?.subtle) {
            console.warn(t(`${i18nPath}.pwnedDisabled`))
        }
    }

    // Запуск диагностики при инициализации плагина
    if (typeof window !== 'undefined') {
        debugCryptoAvailability()
    }
})