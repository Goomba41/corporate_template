<template>
    <div :class="progressClasses">
        <!-- 
          Слот для полной кастомизации визуала прогресс-бара.
          Предоставляет данные: progress (нормализованное значение), value (исходное), max.
          Если слот не переопределён — рендерится дефолтная реализация ниже.
        -->
        <slot
            name="custom"
            :progress="normalizedValue"
            :value="value"
        >
            <div class="progress-bar__track">
                <!-- 
                  Заполнение: визуальная часть прогресса.
                  Ширина задаётся через inline-стиль для динамического обновления.
                  В indeterminate-режиме width не задаётся (управляется через CSS-анимацию).
                -->
                <div
                    class="progress-bar__value"
                    :style="{ 'width': mode === 'determinate' ? currentProgress : undefined }"
                >
                    <div
                        v-if="mode === 'determinate' && (showValue || $slots.default !== undefined)"
                        class="progress-bar__label"
                    >
                        <!-- 
                          Fallback-контент: если слот не передан, показываем вычисленное значение в %.
                          Если слот передан — рендерим его содержимое.
                        -->
                        <template v-if="!$slots.default">
                            {{ currentProgress }}
                        </template>
                        <slot v-else>
                        </slot>
                    </div>
                </div>
            </div>
        </slot>
    </div>
</template>

<script
    setup
    lang="ts"
>
/**
 * Атом: Индикатор прогресса
 * 
 * Отображает визуальный прогресс выполнения задачи.
 * Поддерживает два режима:
 * - `determinate`: известное значение (полоска заполняется на X%)
 * - `indeterminate`: неизвестная длительность (бесконечная анимация)
 * 
 * Компонент следует методологии БЭМ и принципам атомарного дизайна:
 * - Не содержит доменной логики (только отображение прогресса)
 * - Гибко кастомизируется через слоты и CSS-переменные
 * - Типизирован для безопасного использования в TypeScript
 * 
 * @example
 * ```vue
 * <!-- Базовое использование: 75% заполнения -->
 * <ProgressBar :value="75" :max="100" mode="determinate" />
 * 
 * <!-- Indeterminate-режим: бесконечная анимация (например, загрузка) -->
 * <ProgressBar mode="indeterminate" />
 * 
 * <!-- Кастомный визуал через слот -->
 * <ProgressBar :value="score" :max="4">
 *   <template #custom="{ progress }">
 *     <div class="my-bar" :style="{ width: progress + '%' }" />
 *   </template>
 * </ProgressBar>
 * 
 * <!-- Переопределение цвета через CSS-переменную -->
 * <ProgressBar 
 *   :value="50" 
 *   :style="{ '--pb-fill-bg': 'var(--success-500)' }" 
 * />
 * ```
 * 
 * @slot custom - Полная замена визуала. Получает: { progress: number, value: number | null, max: number }
 * @slot default - Кастомный контент внутри текстовой метки (проценты, иконки)
 */

/**
* Интерфейс пропсов компонента
*/
const props = defineProps({
    /** 
     * Текущее значение прогресса.
     * 
     * Поведение в зависимости от режима:
     * - `determinate`: должно быть числом от 0 до max. Если null/undefined — warning + fallback к 0.
     * - `indeterminate`: значение игнорируется (можно передавать null).
     * 
     * @default null
     */
    value: {
        type: Number as PropType<number | null>,
        default: null,
        validator: (value: unknown, props: { max?: number }): boolean => {
            if (value === null || value === undefined) {
                return true
            }
            if (typeof value !== 'number' || !Number.isFinite(value)) {
                console.warn('[ProgressBar] value должно быть числом')
                return false
            }
            if (props.max && value > props.max) {
                console.warn(`[ProgressBar] значение больше максимального`)
                return false
            }
            return true
        }
    },
    /** 
     * Максимальное значение (верхняя граница шкалы).
     * Используется для расчёта процентов: (value / max) * 100.
     * @default 100
     */
    max: {
        type: Number,
        default: 100,
        validator(value: number) {
            if (!Number.isFinite(value) || value <= 0) {
                console.warn('[ProgressBar] max должен быть положительным числом')
                return false
            }
            return true
        }
    },
    /** 
     * Показывать ли текстовое значение (проценты) внутри прогресс-бара.
     * Если передан слот `default`, текст игнорируется в пользу слота.
     * @default true
     */
    showValue: {
        type: Boolean,
        default: true,
    },
    /** 
     * Режим отображения прогресса:
     * - `determinate`: известное значение, полоска заполняется пропорционально value/max
     * - `indeterminate`: неизвестная длительность, показывается бесконечная анимация
     * @default 'determinate'
     */
    mode: {
        type: String as PropType<'indeterminate' | 'determinate'>,
        default: "determinate",
        validator(value: string) {
            return ["indeterminate", "determinate"].includes(value)
        }
    }
})

/**
 * Вычисляет классы для корневого элемента по БЭМ.
 * 
 * Формирует:
 * - Блок: 'progress-bar'
 * - Модификатор: 'progress-bar--determinate' или 'progress-bar--indeterminate'
 * 
 * @returns Array<string> - Массив CSS-классов
 */
const progressClasses = computed(() => ([
    'progress-bar',
    `progress-bar--${props.mode}`
]))

/**
 * Вычисляет ширину заполнения в процентах для inline-стиля.
 * 
 * Формула: (normalizedValue / max) * 100, округлённая до целого.
 * Возвращает строку вида "75%" для использования в :style="{ width: ... }".
 * 
 * @returns ComputedRef<string> - Строка с процентом и символом '%'
 */
const currentProgress = computed(() => `${((normalizedValue.value) / props.max) * 100}%`)

/**
 * Нормализует значение прогресса с учётом режима и валидации.
 * 
 * Логика:
 * 1. В indeterminate-режиме всегда возвращает 0 (значение не используется)
 * 2. В determinate-режиме:
 *    - Если value === null/undefined → warning + fallback к 0
 *    - Иначе → ограничивает значение диапазоном [0, max] (clamp)
 * 
 * @returns ComputedRef<number> - Нормализованное значение от 0 до max
 */
const normalizedValue = computed(() => {
    if (props.mode === 'indeterminate') {
        return 0
    }

    if (props.value === null || props.value === undefined) {
        console.warn('[ProgressBar] value is null in determinate mode, defaulting to 0')
        return 0
    }

    return Math.max(0, Math.min(props.value, props.max))
})
</script>

<style
    lang="scss"
    scoped
>
/**
 * Стили компонента по методологии БЭМ.
 * 
 * Структура:
 * .progress-bar                   — Блок (корневой элемент)
 * .progress-bar__track            — Элемент: фон (незаполненная часть)
 * .progress-bar__value            — Элемент: заполнение (анимированная часть)
 * .progress-bar__label            — Элемент: текстовая метка
 * .progress-bar--determinate      — Модификатор: режим с известным значением
 * .progress-bar--indeterminate    — Модификатор: режим с бесконечной анимацией
 * 
 * Кастомизация через CSS-переменные (хуки):
 * --pb-fill-bg    — цвет заполнения (по умолчанию: var(--primary-500))
 */

.progress-bar {
    --pb-fill-bg: var(--primary-500);
    height: 1.25rem;
    border-radius: 0.5rem;

    &__track {
        border-radius: inherit;
        display: block;
        position: relative;
        overflow: hidden;
        background: var(--border-primary);
        height: 100%;
    }

    &--determinate &__value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        overflow: hidden;
        transition: width 0.3s ease-out, background-color 0.3s ease-in-out;
        min-width: fit-content;
    }


    &--determinate &__label {
        display: inline-flex;
    }

    &--indeterminate &__value {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 40%;
        animation: progress-slide 2.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    &__value {
        margin: 0;
        background: var(--pb-fill-bg);
    }

    &__label {
        color: var(--text-inverse);
        font-size: 0.75rem;
        font-weight: 600;
        margin-inline: 0.5rem;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @keyframes progress-slide {
        0% {
            transform: translateX(-100%);
        }

        50% {
            transform: translateX(250%);
        }

        50.1% {
            /* Мгновенный «перескок» для бесшовного цикла */
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(250%);
        }
    }
}
</style>