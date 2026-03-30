import type {
    PasswordValidationResult,
    PasswordValidationError
} from '~/core/domain/types/password';

/**
 * Ошибка для отображения в UI.
 * Расширяет доменный тип локализованным сообщением.
 */
export interface DisplayablePasswordError extends PasswordValidationError {
    /**
     * Переведённый текст ошибки
     */
    readonly message: string;
}

/**
 * Результат валидации для UI-компонентов.
 */
export interface DisplayablePasswordValidationResult extends PasswordValidationResult {
    /**
     * Переведённый текст уровня сложности пароля
     */
    readonly feedback: string;

    /**
     * Ошибки с текстовыми переводами
     */
    readonly errors: readonly DisplayablePasswordError[];

    /**
     * Предупреждения с текстовыми переводами
     */
    readonly warnings: readonly DisplayablePasswordError[];
}