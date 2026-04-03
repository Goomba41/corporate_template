<script
    setup
    lang="ts"
>
import type { AtomInputText, AtomPopover } from '#components';
import { useFocus, useActiveElement, refDebounced } from '@vueuse/core';

import { PasswordStrengthScore } from '~/core/domain/types/password';
import type { InputProps } from '~/types/input-props';
import type { DisplayablePasswordValidationResult } from '~/types/presentation/password';

/**
 * Молекула: Поле ввода пароля
 * 
 * Расширяет базовый InputText, добавляя:
 * - Переключение видимости пароля (маска/текст)
 * - Отображение состояния валидации в поповере
 * - Интеграцию с focus-логикой через useFocus
 * 
 * @example
 * ```vue
 * <InputPassword 
 *   v-model="password"
 *   :validation-state="strength"
 *   toggle-mask
 *   @input-change="onPasswordChange"
 * />
 * ```
 */

interface Props {
    /** Показать кнопку переключения видимости пароля */
    toggleMask?: boolean;
    /** Показывать ли блок обратной связи по валидации */
    feedback?: boolean;
    /** Состояние валидации пароля (ошибки, предупреждения, оценка) */
    validationState?: DisplayablePasswordValidationResult;
    /** Показать кнопку очистки поля */
    showClear?: boolean;
}

const props = withDefaults(defineProps<Props & Omit<InputProps, 'type'>>(), {
    size: 'md',
    toggleMask: true,
    feedback: false,
    showClear: false
})

const emit = defineEmits<{
    /** Срабатывает при каждом изменении значения (для валидации) */
    'update:modelValue': [value: string]
    /** Срабатывает при "завершённом" вводе: blur, enter, change */
    'input-change': [value: string]
}>()

/** Обработчик "завершённого" изменения значения */
const handleChange = (value: string) => {
    emit('input-change', value)
}

const model = defineModel<string>()

/**
* Слоты для кастомизации поповера валидации
* @slot header - Заголовок поповера (например, "Требования к паролю")
* @slot content - Основной контент (индикатор силы, прогресс)
* @slot footer - Футер поповера (дополнительные подсказки, ошибки валидации)
*/
defineSlots<{
    header?(): unknown;
    content?(): unknown;
    footer?(): unknown;
    maskIcon?(props: { isVisible: boolean }): unknown;
    unmaskIcon?(props: { isVisible: boolean }): unknown;
    clearIcon?(): unknown;
}>();

const passwordClasses = computed(() => ([
    'input-password',
    {
        'input-password--has-actions': props.toggleMask || props.showClear,
    }
]))

/** Локальное состояние видимости пароля (текст/точки) */
const isVisible = ref<boolean>(false)
/** Вычисляемый тип input: переключается между 'password' и 'text' */
const inputType = computed(() => props.toggleMask && isVisible.value ? 'text' : 'password')

// #region 🔽 Управление фокусом
/** Ссылка на экземпляр атома InputText */
const input = ref<InstanceType<typeof AtomInputText> | null>(null)

/** 
 * Computed-обёртка для доступа к внутреннему DOM-элементу input
 * @returns {HTMLInputElement | null} Нативный input элемент или null
 */
const inputAtomRef = computed(() => input.value?.internalInput || null);

/** Reactive-состояние фокуса на поле ввода (из @vueuse/core) */
const { focused: isFocused } = useFocus(inputAtomRef);

/**
 * Watcher для обработки состояния загрузки
 * - После завершения загрузки: возвращает фокус на поле
 * - При начале загрузки: скрывает маску пароля (безопасность)
 */
watch(() => props.loading, async (newValue, oldValue) => {
    if (oldValue && !newValue) {
        await nextTick()

        isFocused.value = true
    }

    if (!oldValue && newValue) isVisible.value = false
}, { flush: 'post' })
// #endregion


// #region 🔽 Управление popover
/** Ref на обёртку инпута — используется как якорь (цель) для позиционирования поповера */
const inputWrapper = ref<HTMLElement | null>(null)

/** Ref на экземпляр атома Popover (для доступа к его внутреннему DOM-элементу) */
const strengthPopover = ref<InstanceType<typeof AtomPopover> | null>(null)
/**
 * Вычисляемый ref на корневой внутренний DOM-элемент телепортированного поповера
 * @returns HTMLElement | null — нативный элемент, в который телепортировался контент
 */
const strengthPopoverRef = computed(() => strengthPopover.value?.element || null);

/**
 * Проверка: находится ли фокус внутри поповера валидации
 * 
 * Механика:
 *   - Сравнивает document.activeElement с корневым элементом поповера
 *   - Благодаря tabindex="0" на контенте поповера, клик мыши устанавливает фокус на этот элемент
 *   - Работает с Teleport, т.к. сравниваются фактические DOM-узлы, а не компоненты Vue
 * 
 * @returns true, если активный элемент === корневой элемент поповера
 */
const isPopoverFocused = computed(() => {
    const el = strengthPopoverRef.value;
    const active = activeElement.value;
    return active === el;
});

/**
 * Условие открытия поповера валидации
 * @returns true, если: есть введённый пароль + есть результат валидации + фокус на инпуте ИЛИ поповере
 */
const isOpenValidation = computed(() => {
    const hasContent = model.value !== undefined && model.value.length > 0;
    const hasValidation = !!props.validationState;
    return hasContent && hasValidation && (isFocused.value || isPopoverFocused.value);
})

/** Реактивный отслеживатель текущего сфокусированного элемента в документе (VueUse) */
const activeElement = useActiveElement()

/**
 * Отложенная версия isOpenValidation для плавного открытия/закрытия
 * Предотвращает визуальное "мигание" при быстром переключении фокуса между инпутом и поповером
 */
const debouncedValidationOpener = refDebounced(isOpenValidation, 150)
// #endregion

// #region 🔽 Расчёт отступов для кнопок
const INPUT_PASSWORD_METRICS = {
    ICON_WIDTH: 1.25,    // ширина, rem
    ICON_GAP: 0.375,     // ширина пространства между иконками
    EDGE_PADDING: 0.375, // ширина пространства от края поля до первой иконки
    BASE_PADDING: 0.75,  // отступ справа, когда нет кнопок
}

const actionCount = computed(() =>
    (props.toggleMask ? 1 : 0) + (props.showClear ? 1 : 0)
)

const cssPadding = computed(() => {
    if (actionCount.value === 0) {
        return `${INPUT_PASSWORD_METRICS.BASE_PADDING}rem`;
    }

    const { ICON_WIDTH, ICON_GAP, EDGE_PADDING } = INPUT_PASSWORD_METRICS;
    const total = EDGE_PADDING * 2 + actionCount.value * ICON_WIDTH + (actionCount.value - 1) * ICON_GAP;

    return `${total}rem`;
});
// #endregion

// #region 🔽 Расчёт текущего цвета прогресса в зависимости от силы пароля
/** Вычисляемая максимальная сила проля */
const maxPasswordScore = computed(() => {
    const numericValues = Object.values(PasswordStrengthScore)
        .filter((v): v is number => typeof v === 'number');
    return Math.max(...numericValues)
})

const stregthColorMap: Record<PasswordStrengthScore, string> = {
    0: 'var(--accent-error)',
    1: 'var(--accent-error)',
    2: 'var(--accent-warning)',
    3: 'var(--accent-success)',
    4: 'linear-gradient(90deg, #D4AF37, #F9E07F)',
}
// #endregion
</script>

<template>
    <div
        class="input-password__wrapper"
        ref="inputWrapper"
    >
        <div
            :class="passwordClasses"
            :style="{
                '--input-icon-width': `${INPUT_PASSWORD_METRICS.ICON_WIDTH}rem`,
                '--input-icon-gap': `${INPUT_PASSWORD_METRICS.ICON_GAP}rem`,
                '--input-edge-padding': `${INPUT_PASSWORD_METRICS.EDGE_PADDING}rem`,
            }"
        >
            <AtomInputText
                ref="input"
                v-model="model"
                :disabled="disabled || loading"
                :placeholder="placeholder"
                :loading="loading"
                :size="size"
                :invalid="invalid"
                :fluid="fluid"
                :variant="variant"
                :type="inputType"
                @input-change="handleChange"
            />

            <Transition name="fade">
                <div
                    v-if="showClear && model?.length && !disabled && !loading"
                    :class="[
                        'input-password__clear',
                    ]"
                    @click="model = ''"
                >
                    <slot name="clearIcon">
                        <IconUiXCircle />
                    </slot>
                </div>
            </Transition>

            <div
                v-if="toggleMask && !disabled && !loading"
                :class="[
                    'input-password__toggle',
                    {
                        'input-password__toggle--password-visible': isVisible
                    }
                ]"
                @click="isVisible = !isVisible"
            >
                <slot
                    :name="isVisible ? 'maskIcon' : 'unmaskIcon'"
                    :is-visible="isVisible"
                >
                    <Transition
                        name="fade"
                        mode="out-in"
                    >
                        <IconUiEyeSlash v-if="isVisible" />
                        <IconUiEye v-else />
                    </Transition>
                </slot>
            </div>

            <AtomPopover
                ref="strengthPopover"
                :triggerer="inputWrapper"
                :open="debouncedValidationOpener"
            >
                <slot name="header" />
                <slot name="content">

                    <div
                        v-if="validationState"
                        class="flex flex-col text-sm items-center"
                    >
                        <AtomProgressBar
                            :style="[
                                'height: 0.5rem',
                                {
                                    '--pb-fill-bg': stregthColorMap[validationState.score]
                                }
                            ]"
                            :class="['mb-2', 'w-full', {
                                'password-progress--gold': validationState.score === maxPasswordScore
                            }]"
                            :value="validationState.score"
                            :max="maxPasswordScore"
                            :show-value="false"
                        />
                        {{ validationState.feedback }}
                    </div>
                </slot>
                <slot name="footer" />
            </AtomPopover>
        </div>
    </div>
</template>

<style
    scoped
    lang="scss"
>
@use "sass:math";

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.password-progress--gold {
    box-shadow: 0 0 6px #D4AF37, 0 0 12px #F9E07F;

    :deep(.progress-bar__value) {
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
            animation: shine 3s infinite;
        }

        @keyframes shine {
            25% {
                left: 200%;
            }

            25.1% {
                /* Мгновенный «перескок» для бесшовного цикла */
                left: -200%;
            }
        }
    }
}

.input-password__wrapper {
    display: flex;
    position: relative;
    border-radius: 0.5rem;

    .input-password {
        width: 100%;

        &--has-actions :deep(input) {
            padding-right: v-bind(cssPadding);
        }

        &__clear {
            color: var(--text-tertiary);
            position: absolute;
            border-radius: 100%;
            display: flex;
            justify-content: center;

            top: 50%;
            transform: translateY(-50%);
            right: calc(var(--input-edge-padding) + var(--input-icon-width) + var(--input-icon-gap));

            &:hover {
                color: var(--text-secondary);
            }
        }

        &__toggle {
            color: var(--text-tertiary);
            position: absolute;
            border-radius: 100%;
            display: flex;
            justify-content: center;

            top: 50%;
            transform: translateY(-50%);
            right: var(--input-edge-padding);


            &:hover {
                color: var(--text-secondary);
            }

            &--password-visible {
                color: var(--primary-500);

                &:hover {
                    color: var(--primary-700);
                }
            }
        }

        :deep(svg) {
            width: var(--input-icon-width);
        }

        :where(.mode-dark) & {
            &__toggle--password-visible {
                color: var(--primary-700);

                &:hover {
                    color: var(--primary-500);
                }
            }
        }
    }
}
</style>
