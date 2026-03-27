import type { HintedString } from "./hinted-string"

/**
 * Пропсы для компонента поля ввода (InputText).
 * Определяет конфигурацию внешнего вида, состояния и поведения элемента.
 * 
 * @interface InputProps
 */
export interface InputProps {
    /**
     * Размер компонента.
     * Влияет на высоту поля и размер шрифта.
     * 
     * @type {'sm' | 'md' | 'lg'}
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * Текст-подсказка, отображаемый когда поле пустое.
     * 
     * @type {string}
     */
    placeholder?: string

    /**
     * Флаг ошибочного состояния.
     * Если true, поле подсвечивается цветом ошибки, определённым в стилях.
     * 
     * @type {boolean}
     * @default false
     */
    invalid?: boolean

    /**
     * Растягивание компонента на всю доступную ширину контейнера.
     * 
     * @type {boolean}
     * @default false
     */
    fluid?: boolean

    /**
     * Вариант визуального оформления.
     * 
     * @type {'filled'}
     * @default undefined
     */
    variant?: 'filled'

    /**
     * Блокировка взаимодействия с полем.
     * Если true, поле недоступно для редактирования и отправки формы.
     * 
     * @type {boolean}
     * @default false
     */
    disabled?: boolean

    /**
     * Индикатор загрузки.
     * Отображать спиннер внутри поля
     * 
     * @type {boolean}
     * @default false
     */
    loading?: boolean

    /**
     * Тип ввода данных.
     * Использует утилиту {@link HintedString} для строгой типизации значений.
     * 
     * @type {HintedString<'text' | 'password'>}
     * @default 'text'
     */
    type?: HintedString<'text' | 'password'>
}


