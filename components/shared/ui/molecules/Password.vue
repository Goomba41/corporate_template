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
}>();

const passwordClasses = computed(() => ([
    'input-password',
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

</script>

<template>
    <div class="input-password__wrapper">
        <div
            class="input-password"
            :class="passwordClasses"
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
            <!-- TODO: кнопка очистки рядом с скрытием/открытием пароля -->
            <!-- TODO: слоты maskIcon, unmaskIcon -->
            <button
                v-if="toggleMask"
                @click="isVisible = !isVisible"
            >toggle vis</button>

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
></style>
