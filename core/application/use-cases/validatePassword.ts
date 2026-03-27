import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

import { type PasswordValidationResult, type PasswordValidationConfig, type PasswordPolicy, PasswordStrengthScore, PasswordStrengthLevel, type PasswordValidationError, ZXCVBN_WARNING_MAP } from '~/core/domain/types/password';

export async function validatePassword(
    password: string,
    config: PasswordValidationConfig
): Promise<PasswordValidationResult> {
    if (!password) {
        return {
            score: PasswordStrengthScore.VeryWeak,
            level: PasswordStrengthLevel[PasswordStrengthScore.VeryWeak],
            errors: [{ code: 'PASSWORD_REQUIRED' }],
            isValid: false
        };
    }

    if (config.pwnCheck?.enabled && config.pwnCheck?.fetchFn && !zxcvbnOptions.matchers['pwned'])
        zxcvbnOptions.addMatcher('pwned', matcherPwnedFactory(config.pwnCheck.fetchFn, zxcvbnOptions))

    const { policy } = config
    const errors = validatePasswordPolicy(password, policy);

    const zxcvbnResult = await zxcvbnAsync(password);
    const isPassedMinLevel = zxcvbnResult.score >= (policy.minThreshold ?? 0);
    const isValid = isPassedMinLevel && errors.length === 0

    const warningKey = zxcvbnResult.feedback.warning;
    if (warningKey) {
        const errorCode = ZXCVBN_WARNING_MAP[warningKey] || 'PASSWORD_INSECURE';
        errors.push({ code: errorCode });
    }

    const toPasswordStrengthScore = (score: number): PasswordStrengthScore => {
        if (score >= 0 && score <= 4) return score as PasswordStrengthScore;
        throw new Error(`Invalid zxcvbn score: ${score}`);
    };

    return {
        score: toPasswordStrengthScore(zxcvbnResult.score),
        level: PasswordStrengthLevel[zxcvbnResult.score],
        errors,
        isValid
    };
}

export function validatePasswordPolicy(
    password: string,
    policy: PasswordPolicy
): PasswordValidationError[] {
    const errors: PasswordValidationError[] = [];

    if (policy.minLength && password.length < policy.minLength) {
        errors.push({ code: 'PASSWORD_TOO_SHORT', params: { minLength: policy.minLength } });
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push({ code: 'PASSWORD_NO_UPPERCASE' });
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push({ code: 'PASSWORD_NO_LOWERCASE' });
    }
    if (policy.requireNumbers && !/[0-9]/.test(password)) {
        errors.push({ code: 'PASSWORD_NO_NUMBERS' });
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
        errors.push({ code: 'PASSWORD_NO_SPECIAL_CHARS' });
    }

    return errors;
}