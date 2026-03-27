/**
 * @fileoverview Nuxt плагин для диагностики доступности Crypto API в браузере.
 * @description Этот плагин проверяет, работает ли код в безопасном контексте (Secure Context),
 * и доступен ли интерфейс `crypto.subtle`. Это необходимо для функций безопасности,
 * таких как хеширование паролей или проверка утечек данных (pwned matcher).
 * @context Client-side (использует объекты window и location)
 */

export default defineNuxtPlugin(() => {

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
        console.log('🔐 Secure context:', window.isSecureContext)
        console.log('🔐 crypto.subtle:', !!window.crypto?.subtle)
        console.log('🌐 Protocol:', location.protocol)
        console.log('🏠 Hostname:', location.hostname)

        if (!window.crypto?.subtle) {
            console.warn('⚠️ crypto.subtle unavailable — pwned matcher is disabled')
            console.warn('💡 Solutions: 1) Use HTTPS, 2) Add SHA-1 polyfill, 3) Skip pwned check')
        }
    }

    // Запуск диагностики при инициализации плагина
    debugCryptoAvailability()
})