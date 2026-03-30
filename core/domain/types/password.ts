/**
 * Уровень важности правила валидации.
 * @typedef {('error'|'warning')} ValidationSeverity
 * @see {@link PolicyRule#severity}
 * @see {@link PasswordValidationError#severity}
 */
export type ValidationSeverity = 'error' | 'warning'

/**
 * Строковый код уровня надёжности пароля.
 * @typedef {('very_weak'|'weak'|'medium'|'strong'|'very_strong')} PasswordStrengthScoreCode
 * @see {@link PasswordStrengthLevel} — маппинг из {@link PasswordStrengthScore}
 * @see {@link PasswordValidationResult#level}
 */
export type PasswordStrengthScoreCode =
    | 'very_weak'
    | 'weak'
    | 'medium'
    | 'strong'
    | 'very_strong'

/**
 * Числовая оценка надёжности пароля по шкале zxcvbn (0–4).
 * @enum {number}
 * @readonly
 * @see {@link PasswordStrengthLevel} для преобразования в строковый код
 * @see {@link PasswordValidationResult} где используется данная оценка
 */
export enum PasswordStrengthScore {
    /** Пароль крайне ненадёжен, взламывается мгновенно */
    VeryWeak = 0,
    /** Пароль ненадёжен, взламывается за короткое время */
    Weak = 1,
    /** Пароль средней надёжности */
    Medium = 2,
    /** Пароль надёжен */
    Strong = 3,
    /** Пароль очень надёжен, устойчив к перебору */
    VeryStrong = 4
}

/**
 * Базовые коды ошибок валидации пароля (локальные проверки).
 * @typedef {('PASSWORD_INSECURE'|'PASSWORD_REQUIRED'|'PASSWORD_TOO_SHORT'|'PASSWORD_NO_LOWERCASE'|'PASSWORD_NO_UPPERCASE'|'PASSWORD_NO_NUMBERS'|'PASSWORD_NO_SPECIAL_CHARS')} PasswordBaseErrorCode
 * @see {@link PasswordErrorCode} — объединяющий тип
 * @see {@link PasswordValidationError#code}
 */
export type PasswordBaseErrorCode =
    | 'PASSWORD_INSECURE' // Пароль не прошел минимальный установленный порог
    | 'PASSWORD_REQUIRED' // Обязательный
    | 'PASSWORD_TOO_SHORT' // Слишком короткий
    | 'PASSWORD_NO_LOWERCASE' // Нет строчных букв
    | 'PASSWORD_NO_UPPERCASE' // Нет заглавных букв
    | 'PASSWORD_NO_NUMBERS' // Нет чисел
    | 'PASSWORD_NO_SPECIAL_CHARS' // Нет специальных символов

/**
 * Коды предупреждений от анализатора zxcvbn (офлайн-проверки).
 * @typedef {('PASSWORD_COMMON'|'PASSWORD_IN_DICTIONARY'|'PASSWORD_HUMAN_NAME'|'PASSWORD_DATE'|'PASSWORD_REPEATS'|'PASSWORD_KEYBOARD_PATTERN'|'PASSWORD_EXCESSIVE')} ZxcvbnWarningCode
 * @see {@link PasswordErrorCode} — объединяющий тип
 * @see {@link ZXCVBN_WARNING_MAP} — маппинг строк zxcvbn → эти коды
 */
export type ZxcvbnWarningCode =
    | 'PASSWORD_COMMON' // Очень популярный пароль
    | 'PASSWORD_IN_DICTIONARY' // Одиночное словарное слово
    | 'PASSWORD_HUMAN_NAME' // Имена, фамилии
    | 'PASSWORD_DATE' // Похож на дату
    | 'PASSWORD_REPEATS' // Повторяющиеся подряд символы
    | 'PASSWORD_KEYBOARD_PATTERN' // Известные клавиатурные паттерны (типа qwerty)
    | 'PASSWORD_EXCESSIVE'; // Можно обойтись без символов в длинных паролях

/**
* Список кодов предупреждений, требующих онлайн-проверки (утечки, топ-списки).
* @constant {readonly ZxcvbnOnlineWarningCode[]}
* @see {@link ZxcvbnOnlineWarningCode} — тип элементов
* @see {@link isZxcvbnOnlineWarningCode} — type guard для проверки
*/
export const ZxcvbnOnlineWarningCodes = [
    'PASSWORD_EXPOSED', // Пароль был раскрыт в результате утечки данных в Интернете
    'PASSWORD_TOP_10', // Пароль в топ 10 утёкших паролей
    'PASSWORD_TOP_100', // Пароль в топ 100 утёкших паролей
    'PASSWORD_SIMILAR', // Похож на очень популярный пароль
] as const;

/**
 * Коды предупреждений zxcvbn, требующие онлайн-проверки.
 * @typedef {typeof ZxcvbnOnlineWarningCodes[number]} ZxcvbnOnlineWarningCode
 * @see {@link ZxcvbnOnlineWarningCodes} — источник значений
 * @see {@link PasswordErrorCode} — объединяющий тип
 */
export type ZxcvbnOnlineWarningCode = typeof ZxcvbnOnlineWarningCodes[number];

/**
 * Ошибка или предупреждение валидации пароля.
 * @interface
 * @see {@link PasswordErrorCode} — тип поля `code`
 * @see {@link ValidationSeverity} — тип поля `severity`
 * @see {@link PasswordValidationResult} — контейнер для массивов этих объектов
 */
export interface PasswordValidationError {
    /** Уникальный код ошибки/предупреждения */
    readonly code: PasswordErrorCode;

    /** Уровень важности: блокирует отправку или лишь рекомендует улучшение */
    readonly severity: ValidationSeverity;

    /** 
     * Параметры для динамической интерполяции сообщения.
     * @type {Record<string, string|number>|undefined}
     * @example { minLength: 12, currentLength: 8 }
     */
    readonly params?: Record<string, string | number>;
}

/**
 * Результат валидации пароля.
 * @interface
 * @see {@link PasswordStrengthScore} — тип поля `score`
 * @see {@link PasswordStrengthScoreCode} — тип поля `level`
 * @see {@link PasswordValidationError} — тип элементов массивов `errors`/`warnings`
 */
export interface PasswordValidationResult {
    /** Числовая оценка надёжности (0–4) */
    readonly score: PasswordStrengthScore;

    /** Текстовый код уровня надёжности для бизнес-логики */
    readonly level: PasswordStrengthScoreCode;

    /** Список критических ошибок валидации */
    readonly errors: readonly PasswordValidationError[];

    /** Список предупреждений (не блокируют валидацию, но рекомендуют улучшение) */
    readonly warnings: readonly PasswordValidationError[];

    /** Флаг: прошёл ли пароль все обязательные проверки */
    readonly isValid: boolean;
}

/**
 * Универсальный тип кода ошибки пароля: объединяет все категории.
 * @typedef {PasswordBaseErrorCode|ZxcvbnWarningCode|ZxcvbnOnlineWarningCode} PasswordErrorCode
 * @see {@link PasswordBaseErrorCode}
 * @see {@link ZxcvbnWarningCode}
 * @see {@link ZxcvbnOnlineWarningCode}
 * @see {@link PasswordValidationError#code}
 * @see {@link PasswordPolicy}
 */
export type PasswordErrorCode = PasswordBaseErrorCode | ZxcvbnWarningCode | ZxcvbnOnlineWarningCode

/**
 * Универсальное правило политики безопасности.
 * @template [T=void] — тип параметра правила (число, оценка, или отсутствует)
 * @interface
 * @see {@link ValidationSeverity} — тип поля `severity`
 * @see {@link PasswordPolicyRule} — объединение возможных специализаций
 */
export interface PolicyRule<T = void> {
    /** Активно ли данное правило */
    enabled: boolean;

    /** Уровень важности: блокирующая ошибка или предупреждение */
    severity: ValidationSeverity;

    /** 
     * Опциональный параметр правила.
     * @type {T|undefined}
     * @example Для `minLength`: `value = 12`
     * @example Для `minStrength`: `value = {@link PasswordStrengthScore}.Strong`
     */
    value?: T;
}

/**
 * Специализированное правило политики паролей.
 * Может принимать числовой параметр, оценку надёжности или не иметь параметра.
 * @typedef {PolicyRule<number>|PolicyRule<PasswordStrengthScore>|PolicyRule<void>} PasswordPolicyRule
 * @see {@link PolicyRule}
 * @see {@link PasswordStrengthScore}
 */
export type PasswordPolicyRule = PolicyRule<number> | PolicyRule<PasswordStrengthScore> | PolicyRule<void>

/**
 * Конфигурация политики паролей: частичная карта кодов ошибок → правила.
 * @typedef {Partial<Record<PasswordErrorCode, PasswordPolicyRule>>} PasswordPolicy
 * @see {@link PasswordErrorCode} — ключи мапы
 * @see {@link PasswordPolicyRule} — значения мапы
 */
export type PasswordPolicy = Partial<Record<PasswordErrorCode, PasswordPolicyRule>>

/**
 * Сопоставление числовой оценки {@link PasswordStrengthScore} с текстовым кодом уровня.
 * Используется в бизнес-логике и UI для отображения статуса.
 * @constant {Record<PasswordStrengthScore, PasswordStrengthScoreCode>}
 * @see {@link PasswordStrengthScoreCode} — тип значений маппинга
 * @see {@link PasswordValidationResult#level} — поле, использующее данный маппинг
 */
export const PasswordStrengthLevel: Record<PasswordStrengthScore, PasswordStrengthScoreCode> = {
    [PasswordStrengthScore.VeryWeak]: 'very_weak',
    [PasswordStrengthScore.Weak]: 'weak',
    [PasswordStrengthScore.Medium]: 'medium',
    [PasswordStrengthScore.Strong]: 'strong',
    [PasswordStrengthScore.VeryStrong]: 'very_strong'
}

// REVIEW: Необходимо вручную проверить все строки, так как есть много несовпадений
/**
 * Маппинг предупреждений zxcvbn → внутренние коды ошибок {@link PasswordErrorCode}.
 * @constant {Record<string, PasswordErrorCode>}
 * @see {@link PasswordErrorCode} — тип значений
 * @see {@link ZxcvbnWarningCode} — подмножество ключей
 * @see {@link isZxcvbnOnlineWarningCode} — для онлайн-проверок
 * @deprecated Требует ручной верификации: возможны несовпадения строк
 */
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

/**
 * Type guard: проверяет, является ли строка кодом онлайн-предупреждения.
 * @function
 * @param {string} code — проверяемое значение
 * @returns {code is ZxcvbnOnlineWarningCode}
 * @see {@link ZxcvbnOnlineWarningCode}
 * @see {@link ZxcvbnOnlineWarningCodes}
 * @example
 * if (isZxcvbnOnlineWarningCode(code)) {
 *   // code имеет тип ZxcvbnOnlineWarningCode
 *   await checkOnlineExposure(code);
 * }
 */
export function isZxcvbnOnlineWarningCode(code: string): code is ZxcvbnOnlineWarningCode {
    return ZxcvbnOnlineWarningCodes.includes(code as ZxcvbnOnlineWarningCode);
}

/**
 * Фабрика для создания правил политики.
 * @namespace
 * @see {@link PolicyRule} — возвращаемый тип
 * @see {@link ValidationSeverity} — используемые уровни важности
 */
export const PolicyRule = {
    /**
     * Создать правило с уровнем важности "ошибка".
     * @template T
     * @param {T} [value] — опциональный параметр правила
     * @returns {PolicyRule<T>}
     * @example PolicyRule.error(12) // minLength: 12 как error
     */
    error: <T = void>(value?: T): PolicyRule<T> =>
        ({ enabled: true, severity: 'error', value }),

    /**
     * Создать правило с уровнем важности "предупреждение".
     * @template T
     * @param {T} [value] — опциональный параметр правила
     * @returns {PolicyRule<T>}
     * @example PolicyRule.warning({@link PasswordStrengthScore}.Medium)
     */
    warning: <T = void>(value?: T): PolicyRule<T> =>
        ({ enabled: true, severity: 'warning', value }),

    /**
     * Создать отключённое правило.
     * @template T
     * @returns {PolicyRule<T>}
     * @example PolicyRule.disabled() // отключить проверку
     */
    disabled: <T = void>(): PolicyRule<T> =>
        ({ enabled: false, severity: 'error', value: undefined }),
} as const