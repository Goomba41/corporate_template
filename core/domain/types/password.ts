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
    readonly score: PasswordStrengthScore;
    readonly level: PasswordStrengthScoreCode;
    readonly errors: readonly PasswordValidationError[]
    readonly warnings: readonly PasswordValidationError[]
    readonly isValid: boolean;
}

// Уровень важности правила
export type ValidationSeverity = 'error' | 'warning'

// Универсальное правило политики
export interface PolicyRule<T = void> {
  enabled: boolean
  severity: ValidationSeverity
  value?: T  // Для правил с параметрами (minLength: 12, maxAge: 90)
}

export type PasswordPolicyRule = PolicyRule<number> | PolicyRule<PasswordStrengthScore> | PolicyRule<void>

export type PasswordPolicy = Partial<Record<PasswordErrorCode, PasswordPolicyRule>>

// Фабрика создания политик
export const PolicyRule = {
  error: <T = void>(value?: T): PolicyRule<T> => 
    ({ enabled: true, severity: 'error', value }),
  
  warning: <T = void>(value?: T): PolicyRule<T> => 
    ({ enabled: true, severity: 'warning', value }),
  
  disabled: <T = void>(): PolicyRule<T> => 
    ({ enabled: false, severity: 'error', value: undefined }),
} as const

// REVIEW: Необходимо вручную проверить все строки, так как есть много несовпадений
export const ZXCVBN_WARNING_MAP: Record<string, PasswordErrorCode> = {
    'This is a top-10 common password.': 'PASSWORD_TOP_10',
    'This is a top-100 common password.': 'PASSWORD_TOP_100',
    'This is a very common password.': 'PASSWORD_COMMON',
    'This is a frequently used password.': 'PASSWORD_COMMON',
    'This is similar to a commonly used password.': 'PASSWORD_SIMILAR',
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

export type PasswordBaseErrorCode =
    | 'PASSWORD_INSECURE' // Пароль не прошел минимальный установленный порог
    | 'PASSWORD_REQUIRED' // Обязательный
    | 'PASSWORD_TOO_SHORT' // Слишком короткий
    | 'PASSWORD_NO_LOWERCASE' // Нет строчных букв
    | 'PASSWORD_NO_UPPERCASE' // Нет заглавных букв
    | 'PASSWORD_NO_NUMBERS' // Нет чисел
    | 'PASSWORD_NO_SPECIAL_CHARS' // Нет специальных символов

export type ZxcvbnWarningCode =    
    | 'PASSWORD_COMMON' // Очень популярный пароль
    | 'PASSWORD_IN_DICTIONARY' // Одиночное словарное слово
    | 'PASSWORD_HUMAN_NAME' // Имена, фамилии
    | 'PASSWORD_DATE' // Похож на дату
    | 'PASSWORD_REPEATS' // Повторяющиеся подряд символы
    | 'PASSWORD_KEYBOARD_PATTERN' // Известные клавиатурные паттерны (типа qwerty)
    | 'PASSWORD_EXCESSIVE'; // Можно обойтись без символов в длинных паролях

export const ZxcvbnOnlineWarningCodes = [
    'PASSWORD_EXPOSED', // Пароль был раскрыт в результате утечки данных в Интернете
    'PASSWORD_TOP_10', // Пароль в топ 10 утёкших паролей
    'PASSWORD_TOP_100', // Пароль в топ 100 утёкших паролей
    'PASSWORD_SIMILAR', // Похож на очень популярный пароль
] as const;

export type ZxcvbnOnlineWarningCode = typeof ZxcvbnOnlineWarningCodes[number];

export function isZxcvbnOnlineWarningCode(code: string): code is ZxcvbnOnlineWarningCode {
    return ZxcvbnOnlineWarningCodes.includes(code as ZxcvbnOnlineWarningCode);
}

export type PasswordErrorCode = PasswordBaseErrorCode | ZxcvbnWarningCode | ZxcvbnOnlineWarningCode

export interface PasswordValidationError {
    readonly code: PasswordErrorCode;
    readonly severity: ValidationSeverity;
    readonly params?: Record<string, string | number>; // Для динамической подстановки (например, мин. длина)
}