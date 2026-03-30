import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

import { type PasswordValidationResult, type PasswordPolicy, PasswordStrengthScore, PasswordStrengthLevel, type PasswordValidationError, ZXCVBN_WARNING_MAP, PolicyRule, type PasswordErrorCode, type PasswordPolicyRule, ZxcvbnOnlineWarningCodes, isZxcvbnOnlineWarningCode } from '~/core/domain/types/password';

export async function validatePassword(
    password: string,
    policy: PasswordPolicy
): Promise<PasswordValidationResult> {
    if (!password) {
        return {
            score: PasswordStrengthScore.VeryWeak,
            level: PasswordStrengthLevel[PasswordStrengthScore.VeryWeak],
            errors: [{ code: 'PASSWORD_REQUIRED', severity: 'error' }],
            warnings: [],
            isValid: false
        };
    }

    const policyOnlineRequired = Object.keys(policy).some((p) => isZxcvbnOnlineWarningCode(p))

    const errors: PasswordValidationError[] = [];
    const warnings: PasswordValidationError[] = [];

    const addValidationResult = (
        rule: PasswordPolicyRule,
        code: PasswordErrorCode,
        failed: boolean,
        params?: Record<string, any>
    ) => {
        if (!rule.enabled || !failed) return

        const entry: PasswordValidationError = { code, severity: rule.severity, params }
        if (rule.severity === 'error') {
            errors.push(entry)
        } else {
            warnings.push(entry)
        }
    }

    // 1. Проверка минимальной длины
    if (policy.PASSWORD_TOO_SHORT?.enabled && password.length < policy.PASSWORD_TOO_SHORT.value!)
        addValidationResult(
            policy.PASSWORD_TOO_SHORT,
            'PASSWORD_TOO_SHORT',
            true,
            { minLength: policy.PASSWORD_TOO_SHORT.value }
        )

    // 2. Проверка требований к составу символов
    if (policy.PASSWORD_NO_UPPERCASE?.enabled && !/[A-Z]/.test(password))
        addValidationResult(policy.PASSWORD_NO_UPPERCASE, 'PASSWORD_NO_UPPERCASE', true)

    if (policy.PASSWORD_NO_LOWERCASE?.enabled && !/[a-z]/.test(password))
        addValidationResult(policy.PASSWORD_NO_LOWERCASE, 'PASSWORD_NO_LOWERCASE', true)

    if (policy.PASSWORD_NO_NUMBERS?.enabled && !/[0-9]/.test(password))
        addValidationResult(policy.PASSWORD_NO_NUMBERS, 'PASSWORD_NO_NUMBERS', true)

    if (policy.PASSWORD_NO_SPECIAL_CHARS?.enabled && !/[!@#$%^&*]/.test(password))
        addValidationResult(policy.PASSWORD_NO_SPECIAL_CHARS, 'PASSWORD_NO_SPECIAL_CHARS', true)

    // 3. Оценка силы пароля (энтропия, словари, паттерны и пр.)
    const zxcvbnResult = await zxcvbnAsync(password);

    // 4. Проверка порога надёжности
    if (policy.PASSWORD_INSECURE?.enabled && zxcvbnResult.score < (policy.PASSWORD_INSECURE.value ?? 0))
        addValidationResult(
            policy.PASSWORD_INSECURE,
            'PASSWORD_INSECURE',
            true,
            { minThreshold: policy.PASSWORD_INSECURE.value }
        )

    const warningKey = zxcvbnResult.feedback.warning;
    if (warningKey) {
        const errorCode = ZXCVBN_WARNING_MAP[warningKey];
        if (errorCode !== undefined && policy[errorCode]) {
            addValidationResult(policy[errorCode], errorCode, true)
        }
    }

    const isValid = errors.length === 0

    const toPasswordStrengthScore = (score: number): PasswordStrengthScore => {
        if (score >= 0 && score <= 4) return score as PasswordStrengthScore;
        throw new Error(`Invalid zxcvbn score: ${score}`);
    };

    return {
        score: toPasswordStrengthScore(zxcvbnResult.score),
        level: PasswordStrengthLevel[zxcvbnResult.score],
        errors: Object.freeze(errors),
        warnings: Object.freeze(warnings),
        isValid
    };
}
