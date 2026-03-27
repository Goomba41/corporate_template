/**
 * Числовая оценка zxcvbn (0-4).
 * Используем числовой enum для прямой совместимости с библиотекой.
 */
export enum PasswordStrengthScore {
    VeryWeak = 0,
    Weak = 1,
    Medium = 2,
    Strong = 3,
    VeryStrong = 4
}

/**
 * Текстовый уровень для бизнес-логики и UI.
 */
export const PasswordStrengthLevel: Record<PasswordStrengthScore, PasswordStrengthScoreCode> = {
    [PasswordStrengthScore.VeryWeak]: 'very_weak',
    [PasswordStrengthScore.Weak]: 'weak',
    [PasswordStrengthScore.Medium]: 'medium',
    [PasswordStrengthScore.Strong]: 'strong',
    [PasswordStrengthScore.VeryStrong]: 'very_strong'
}

export type PasswordStrengthScoreCode = 
    | 'very_weak'
    | 'weak'
    | 'medium'
    | 'strong'
    | 'very_strong'

export interface PasswordValidationResult {
    score: PasswordStrengthScore;
    level: string;
    errors: PasswordValidationError[];
    isValid: boolean;
}

export interface PasswordPolicy {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge?: number;
    minThreshold?: PasswordStrengthScore;
    pwnCheck?: boolean;
}

export interface PasswordValidationConfig {
    policy: PasswordPolicy;
    pwnCheck?: {
        enabled: boolean;
        fetchFn?: typeof fetch; // Для инъекции (тесты/прокси)
    };
}

// REVIEW: Необходимо вручную проверить все строки, так как есть много несовпадений
export const ZXCVBN_WARNING_MAP: Record<string, PasswordErrorCode> = {
    'This is a top-10 common password.': 'PASSWORD_TOP_10',
    'This is a top-100 common password.': 'PASSWORD_TOP_100',
    'This is a very common password.': 'PASSWORD_COMMON',
    'This is similar to a commonly used password.': 'PASSWORD_SIMILIAR',
    'A word by itself is easy to guess.': 'PASSWORD_IN_DICTIONARY',
    'Names and surnames by themselves are easy to guess.': 'PASSWORD_HUMAN_NAME',
    'Common names and surnames are easy to guess.': 'PASSWORD_HUMAN_NAME',
    'Dates are often easy to guess.': 'PASSWORD_DATE',
    'Avoid years that are associated with you.': 'PASSWORD_DATE',
    'Repeated characters like "aaa" are easy to guess.': 'PASSWORD_REPEATS',
    'Straight rows of keys are easy to guess.': 'PASSWORD_KEYBOARD_PATTERN',
    'Short keyboard patterns are easy to guess.': 'PASSWORD_KEYBOARD_PATTERN',
    'There is no need for symbols, digits, or uppercase letters.': 'PASSWORD_EXCESSIVE',
    'Your password was exposed by a data breach on the Internet.': 'PASSWORD_EXPOSED',
};

export type PasswordErrorCode =
    | 'PASSWORD_INSECURE' // Пароль не прошел минимальный установленный порог
    | 'PASSWORD_REQUIRED' // Обязательный
    | 'PASSWORD_TOO_SHORT' // Слишком короткий
    | 'PASSWORD_NO_LOWERCASE' // Нет строчных букв
    | 'PASSWORD_NO_UPPERCASE' // Нет заглавных букв
    | 'PASSWORD_NO_NUMBERS' // Нет чисел
    | 'PASSWORD_NO_SPECIAL_CHARS' // Нет специальных символов
    | 'PASSWORD_EXPOSED' // Пароль был раскрыт в результате утечки данных в Интернете
    | 'PASSWORD_TOP_10' // Пароль в топ 10 утёкших паролей
    | 'PASSWORD_TOP_100' // Пароль в топ 100 утёкших паролей
    | 'PASSWORD_COMMON' // Очень популярный пароль
    | 'PASSWORD_SIMILIAR' // Похож на очень популярный пароль
    | 'PASSWORD_IN_DICTIONARY' // Одиночное словарное слово
    | 'PASSWORD_HUMAN_NAME' // Имена, фамилии
    | 'PASSWORD_DATE' // Похож на дату
    | 'PASSWORD_REPEATS' // Повторяющиеся подряд символы
    | 'PASSWORD_KEYBOARD_PATTERN' // Известные клавиатурные паттерны (типа qwerty)
    | 'PASSWORD_EXCESSIVE'; // Можно обойтись без символов в длинных паролях

// TODO: разбить на ошибки и warning
export interface PasswordValidationError {
    code: PasswordErrorCode;
    params?: Record<string, string | number>; // Для динамической подстановки (например, мин. длина)
}