/**
 * Тип для строк с автозаполнением, но без жесткого ограничения.
 * 
 * Позволяет использовать конкретные литералы с автозаполнением,
 * но разрешает любую строку для кастомизации.
 * @example severity: HintedString<'success' | 'error'>
 */
export type HintedString<T extends string> = T | (string & {});