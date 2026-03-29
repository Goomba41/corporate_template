// composables/shared/usePasswordStrength.ts
import { ref, computed, watch, type Ref } from 'vue';

import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import { validatePassword } from '~/core/application/use-cases/validatePassword';
import type { PasswordPolicy, PasswordValidationResult, PasswordValidationError } from '~/core/domain/types/password';

export function usePasswordStrength(
    passwordRef: Ref<string>,
    policy: PasswordPolicy = { minLength: 10, requireUppercase: true, requireNumbers: true, requireLowercase: true, requireSpecialChars: false },
    options: {
        debounceMs?: number
    }
) {
    const { debounceMs = 300 } = options;
    const { isOnline, isHttps } = useNetwork()
    const isChecking = ref(false)

    const state = ref<PasswordValidationResult>({
        score: 0,
        level: 'very_weak',
        errors: [],
        isValid: false
    });

    const validate = async (pwd: string) => {
        isChecking.value = true; // Включаем спиннер

        try {
            return await validatePassword(pwd, {
                policy,
                pwnCheck: isOnline.value && isHttps.value ? { enabled: true, fetchFn: fetch } : undefined
            })
        } catch (error) {
            throw error
        } finally {
            isChecking.value = false;
        }
    };

    const debouncedValidate = useDebounceFn((pwd: string) => validate(pwd), debounceMs)

    // Магия debounce: валидация запустится только через 300мс после прекращения ввода
    watch(passwordRef, (newVal) => {
        debouncedValidate(newVal);
    });

    return {
        validationState: computed(() => state.value),
        isChecking: computed(() => isChecking.value)
    };
}