import { ref, computed, watch, type Ref } from 'vue';

import { useDebounceFn } from '@vueuse/core';

import { validatePassword } from '~/core/application/use-cases/validatePassword';
import { isZxcvbnOnlineWarningCode, type PasswordPolicy, type PasswordValidationError } from '~/core/domain/types/password';
import type { DisplayablePasswordValidationResult } from '~/types/presentation/password';

/**
 * WeakMap для отслеживания использования одного и того же `Ref` в нескольких 
 * экземплярах комозабла в режиме разработки.
 * Помогает отлавливать анти-паттерн повторного использования реактивного состояния.
 * @private
 */
const modelRegistry = import.meta.dev ? new WeakMap<Ref<any>, number>() : null

/**
 * Composable для валидации силы пароля с поддержкой политик безопасности, 
 * отложенного ввода и международной локализации.
 * 
 * @remarks
 * - Использует `validatePassword` из слоя применения (Application Layer) для выполнения 
 *   бизнес-логики валидации.
 * - Автоматически фильтрует политики, требующие онлайн-проверки, если нет соединения.
 * - Возвращаемое состояние защищено от мутаций через `readonly`.
 * 
 * ⚠️ **Важно:** Создавайте отдельный экземпляр комозабла для каждого поля ввода!
 * Не используйте один экземпляр `usePasswordStrength` для нескольких `passwordRef`.
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const password = ref('')
 * const policy: PasswordPolicy = {
 *   minLength: { enabled: true, value: 12 },
 *   requireUppercase: { enabled: true },
 *   checkPwned: { enabled: true } // Требует HTTPS и онлайн
 * }
 * 
 * const { validationState, isChecking } = usePasswordStrength(password, policy)
 * </script>
 * ```
 * 
 * @example
 * ```ts
 * // С настроенным отложенным водом (по умолчанию 500мс)
 * const { validationState } = usePasswordStrength(passwordRef, policy, { debounceMs: 300 })
 * ```
 * 
 * @param passwordRef - Реактивная ссылка на значение пароля для валидации
 * @param policy - Конфигурация политик безопасности пароля
 * @param options - Дополнительные настройки комозабла
 * @param options.debounceMs - Задержка в миллисекундах перед валидацией после ввода (по умолчанию: 500)
 * 
 * @returns Объект с реактивным состоянием валидации и флагом загрузки
 * @returns.validationState - Вычисляемое свойство с результатом валидации (только для чтения)
 * @returns.isChecking - Флаг выполнения асинхронной проверки (только для чтения)
 * 
 * @category Composables/Security
 * @public
 */
export function usePasswordStrength(
    passwordRef: Ref<string>,
    policy: PasswordPolicy = {},
    options?: {
        /** Задержка в миллисекундах перед выполнением валидации после изменения ввода */
        debounceMs?: number
    }
): {
    /** Реактивное состояние результата валидации пароля (только для чтения) */
    validationState: Readonly<Ref<DisplayablePasswordValidationResult>>;
    /** Флаг выполнения асинхронной проверки пароля (только для чтения) */
    isChecking: Readonly<Ref<boolean>>;
} {
    const { t } = useI18n()

    // Отлавливание использования одного ref в разных экземплярах хука
    if (import.meta.dev && modelRegistry) {
        const count = modelRegistry.get(passwordRef) || 0
        if (count > 0) {
            const warning = t('system.composable_same_ref', { name: 'usePasswordStrength', count: count + 1 })
            console.warn(warning)
        }
        modelRegistry.set(passwordRef, count + 1)
    }

    const debounceMs = options ? options.debounceMs : 500;
    const { isOnline, isHttps } = useNetwork()

    /** @internal Флаг выполнения асинхронной валидации */
    const isChecking = ref(false)

    /** 
     * Реактивная обертка для политик с поверхностным отслеживанием.
     * Оптимизация: не отслеживать глубокие изменения объекта политик (shallowRef).
     * @internal 
     */
    const policyRef = shallowRef(policy)

    /**
     * Отфильтрованные политики безопасности с учётом сетевого статуса.
     * Исключает политики, требующие онлайн-проверки, если нет соединения или HTTPS.
     * 
     * @internal
     * @returns Объект политик, актуальных для текущих условий сети
     */
    const filteredPolicies = computed<PasswordPolicy>(() =>
        Object.entries(policyRef.value).reduce<PasswordPolicy>((acc, [key, value]) => {
            const policyOnlineRequired = isZxcvbnOnlineWarningCode(key)

            // Включаем политику, если:
            // 1. Она активна И
            // 2. Она не требует онлайн ИЛИ (требует онлайн И есть соединение + HTTPS)
            if (
                value.enabled && (
                    !policyOnlineRequired || (
                        policyOnlineRequired && isOnline.value && isHttps.value
                    )
                )
            )
                return { ...acc, [key]: value }
            return acc
        }, {} as PasswordPolicy)
    );

    /**
     * Внутреннее реактивное состояние результата валидации.
     * Инициализируется значением "очень слабый пароль".
     * @internal
     */
    const state = ref<DisplayablePasswordValidationResult>({
        score: 0,
        level: 'very_weak',
        errors: [],
        warnings: [],
        isValid: false,
        feedback: t(`password.levels.very_weak`)
    });

    /**
     * Публичное вычисляемое состояние валидации с защитой от мутаций.
     * Массивы ошибок и предупреждений также обернуты в `readonly`.
     * 
     * @returns Защищённое от записи состояние валидации
     * @public
     */
    const validationState = computed((): Readonly<DisplayablePasswordValidationResult> =>
        readonly({
            score: state.value.score,
            level: state.value.level,
            errors: readonly([...state.value.errors]),
            warnings: readonly([...state.value.warnings]),
            isValid: state.value.isValid,
            feedback: state.value.feedback
        })
    );

    /**
     * Вспомогательная функция для локализации объектов ошибок/предупреждений.
     * Добавляет переведённое сообщение на основе кода ошибки и параметров.
     * 
     * @param error - Объект ошибки домена с кодом и параметрами
     * @returns Объект ошибки с локализованным сообщением
     * @internal
     */
    const getTranslationText = (error: PasswordValidationError) => ({
        ...error,
        message: t(`password.errors.${error.code}`, error.params
            ? {
                ...error.params,
                count: error.params?.minLength,
            }
            : {}
        )
    })

    /**
     * Основная функция валидации пароля.
     * Вызывает use-case валидации и обновляет реактивное состояние.
     * 
     * @param pwd - Пароль для проверки
     * @throws {Error} В режиме разработки при ошибке валидации (для отладки)
     * @internal
     */
    const validate = async (pwd: string) => {
        isChecking.value = true; // Включаем спиннер

        try {
            const validationResult = await validatePassword(pwd, filteredPolicies.value)

            state.value = {
                ...validationResult,
                errors: validationResult.errors.map((error) => getTranslationText(error)),
                warnings: validationResult.warnings.map((warning) => getTranslationText(warning)),
                feedback: t(`password.levels.${validationResult.level}`)
            }
        } catch (error) {
            console.error('[usePasswordStrength] Validation failed:', error)
            state.value = {
                score: 0,
                level: 'very_weak',
                errors: [{
                    code: 'PASSWORD_VALIDATION_ERROR',
                    severity: 'error',
                    message: t('password.errors.validation_failed')
                }],
                warnings: [],
                isValid: false,
                feedback: t('password.errors.validation_failed')
            }

            if (import.meta.dev) throw error
        } finally {
            isChecking.value = false;
        }
    };

    /**
     * Версия функции валидации с отложенным запуском.
     * Откладывает выполнение валидации на `debounceMs` после последнего изменения ввода.
     * @internal
     */
    const debouncedValidate = useDebounceFn((pwd: string) => validate(pwd), debounceMs)

    // Валидация запустится только через заданное количество миллисекунд после прекращения ввода
    watch(passwordRef, (newVal) => debouncedValidate(newVal));

    return {
        validationState,
        isChecking: shallowReadonly(isChecking)
    };
}