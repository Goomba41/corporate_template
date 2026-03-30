import { ref, computed, watch, type Ref } from 'vue';

import { useDebounceFn } from '@vueuse/core';

import { validatePassword } from '~/core/application/use-cases/validatePassword';
import { isZxcvbnOnlineWarningCode, type PasswordPolicy, type PasswordValidationError } from '~/core/domain/types/password';
import type { DisplayablePasswordValidationResult } from '~/types/presentation/password';

export function usePasswordStrength(
    passwordRef: Ref<string>,
    policy: PasswordPolicy = {},
    options?: {
        debounceMs?: number
    }
) {
    const debounceMs = options ? options.debounceMs : 500;
    const { isOnline, isHttps } = useNetwork()
    const isChecking = ref(false)
    const { t } = useI18n()

    const filteredPolicies = computed<PasswordPolicy>(() =>
        Object.entries(policy).reduce<PasswordPolicy>((acc, [key, value]) => {
            const policyOnlineRequired = isZxcvbnOnlineWarningCode(key)
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

    const state = ref<DisplayablePasswordValidationResult>({
        score: 0,
        level: 'very_weak',
        errors: [],
        warnings: [],
        isValid: false,
        feedback: t(`password.levels.very_weak`)
    });

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
            throw error
        } finally {
            isChecking.value = false;
        }
    };

    const debouncedValidate = useDebounceFn((pwd: string) => validate(pwd), debounceMs)

    // Валидация запустится только через заданное количество миллисекунд после прекращения ввода
    watch(passwordRef, (newVal) => debouncedValidate(newVal));

    return {
        validationState,
        isChecking: computed(() => isChecking.value)
    };
}