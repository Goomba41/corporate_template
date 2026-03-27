import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

import type { PasswordValidationResult, PasswordValidationConfig, PasswordPolicy } from '~/core/domain/types/password';

export async function validatePassword(
    password: string,
    config: PasswordValidationConfig
): Promise<PasswordValidationResult> {
    if (!password) {
        return { score: 0, feedback: '', errors: ['Пароль обязателен'], isValid: false };
    }

    if (config.pwnCheck?.enabled && config.pwnCheck?.fetchFn && !zxcvbnOptions.matchers['pwned'] && window.crypto?.subtle && window.isSecureContext)
        zxcvbnOptions.addMatcher('pwned', matcherPwnedFactory(config.pwnCheck.fetchFn, zxcvbnOptions))

    const zxcvbnResult = await zxcvbnAsync(password);
    const isZxcvbnOk = zxcvbnResult.score >= 3;

    const { policy } = config
    const errors: string[] = validatePasswordPolicy(password, policy);

    return {
        score: zxcvbnResult.score as any,
        feedback: zxcvbnResult.feedback.warning || errors[0] || 'Пароль надежный',
        errors: [...errors, ...(isZxcvbnOk ? [] : ['Слишком простой пароль'])],
        isValid: isZxcvbnOk && errors.length === 0
    };
}

export function validatePasswordPolicy(
    password: string,
    policy: PasswordPolicy
): string[] {
    const errors: string[] = [];

    if (policy.minLength && password.length < policy.minLength) {
        errors.push(`Минимум ${policy.minLength} символов`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Требуется заглавная буква');
    }
    if (policy.requireNumbers && !/[0-9]/.test(password)) {
        errors.push('Требуется цифра');
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
        errors.push('Требуется специальный символ');
    }

    return errors;
}