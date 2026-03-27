export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordValidationResult {
    score: PasswordStrengthScore;
    feedback: string;
    errors: string[];
    isValid: boolean;
}

export interface PasswordPolicy {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge?: number;
    pwnCheck?: boolean;
}

export interface PasswordValidationConfig {
    policy: PasswordPolicy;
    pwnCheck?: {
        enabled: boolean;
        fetchFn?: typeof fetch; // Для инъекции (тесты/прокси)
    };
}