<script
    setup
    lang="ts"
>
import type { AtomInputText } from '#components';
import { useFocus } from '@vueuse/core';

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

// 🔽 Управление фокусом

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

// 🔽 Расчёт отступов для кнопок

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
</script>

<template>
    <div class="input-password__wrapper">
        <div :class="passwordClasses">
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

            <Transition
                name="fade"
                mode="out-in"
            >
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
                        mode="in-out"
                    >
                        <IconUiEyeSlash v-if="isVisible" />
                        <IconUiEye v-else />
                    </Transition>
                </slot>
            </div>

            <!-- TODO: атом popover, в default слот которого помещаются
              слотамы header, content, footer пароля -->
            <div v-if="isFocused && model !== undefined && model.length && validationState !== undefined">
                {{ validationState.feedback }}
                <template v-if="validationState.errors.length">
                    <h5 class="mt-4 mb-4 text-red">Ошибки:</h5>
                    <div
                        v-for="error in validationState.errors"
                        :key="error.code"
                    >
                        {{ error.message }}
                    </div>
                </template>
                <template v-if="validationState.warnings.length">
                    <h5 class="mt-4 mb-4 text-warning">Предупреждения:</h5>
                    <div
                        v-for="warning in validationState.warnings"
                        :key="warning.code"
                    >
                        {{ warning.message }}
                    </div>
                </template>
            </div>
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

.input-password__wrapper {
    $toggle-icon-padding: 2rem;
    $toggle-icon-width: 1.25rem;

    display: flex;
    position: relative;
    border-radius: 0.5rem;

    .input-password {
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
            right: $toggle-icon-width + (math.div($toggle-icon-padding - $toggle-icon-width, 2) * 2);

            &:hover {
                color: var(--text-secondary);
            }

            :deep(svg) {
                width: $toggle-icon-width;
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
            right: math.div($toggle-icon-padding - $toggle-icon-width, 2);


            &:hover {
                color: var(--text-secondary);
            }

            &--password-visible {
                color: var(--primary-500);

                &:hover {
                    color: var(--primary-700);
                }
            }

            :deep(svg) {
                width: $toggle-icon-width;
            }
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
