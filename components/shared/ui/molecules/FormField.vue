<!-- components/shared/ui/molecules/FormField.vue -->
<script
    setup
    lang="ts"
>
import { computed } from 'vue'
// import Label from '~/components/shared/ui/atoms/Label.vue'
import ErrorMessage from '~/components/shared/ui/atoms/Message.vue'
// import HintText from '~/components/shared/ui/atoms/HintText.vue'
// import CharacterCounter from '~/components/shared/ui/atoms/CharacterCounter.vue'
// import Icon from '~/components/shared/ui/atoms/Icon.vue'

interface Props {
    label?: string
    error?: string | null
    hint?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    focused?: boolean
    type?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'filled' | 'outlined' | 'underlined'
    maxLength?: number
    modelValue?: string | number
    prefixIcon?: string
    suffixIcon?: string
    prefixText?: string
    suffixText?: string
    showCounter?: boolean
    classes?: string
    style?: string
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    error: null,
    hint: '',
    required: false,
    disabled: false,
    readonly: false,
    focused: false,
    type: 'text',
    size: 'md',
    variant: 'default',
    maxLength: undefined,
    modelValue: '',
    prefixIcon: undefined,
    suffixIcon: undefined,
    prefixText: undefined,
    suffixText: undefined,
    showCounter: false,
    classes: '',
    style: ''
})

const emit = defineEmits<{
    focus: []
    blur: []
    iconClick: [position: 'prefix' | 'suffix']
}>()

const hasError = computed(() => !!props.error)
const hasHint = computed(() => !!props.hint)
const hasCounter = computed(() => props.showCounter && props.maxLength)
const currentLength = computed(() => {
    if (typeof props.modelValue === 'string') {
        return props.modelValue.length
    }
    return 0
})
const isCounterExceeded = computed(() => {
    if (!props.maxLength) return false
    return currentLength.value > props.maxLength
})

const handleFocus = () => emit('focus')
const handleBlur = () => emit('blur')
const handleIconClick = (position: 'prefix' | 'suffix') => emit('iconClick', position)
</script>

<template>
    <div
        class="form-field"
        :class="[
            `form-field--${variant}`,
            `form-field--${size}`,
            {
                'form-field--error': hasError,
                'form-field--disabled': disabled,
                'form-field--readonly': readonly,
                'form-field--focused': focused
            },
            classes
        ]"
        :style="style"
    >
        <!-- Лейбл (атом) -->
        <!-- <Label
            v-if="label"
            :for="`field-${Math.random().toString(36).substr(2, 9)}`"
            :required="required"
            :error="hasError"
            :size="size"
        >
            {{ label }}
        </Label> -->

        <!-- Обертка для поля ввода -->
        <div class="form-field__wrapper">
            <!-- Префикс -->
            <!-- <div
                v-if="prefixIcon || prefixText"
                class="form-field__prefix"
                @click="prefixIcon ? handleIconClick('prefix') : undefined"
            >
                <Icon
                    v-if="prefixIcon"
                    :name="prefixIcon"
                    class="form-field__prefix-icon"
                />
                <span
                    v-if="prefixText"
                    class="form-field__prefix-text"
                >{{ prefixText }}</span>
            </div> -->

            <!-- Слот для поля ввода -->
            <div class="form-field__input-slot">
                <slot
                    name="input"
                    :invalid="hasError"
                />
                <!-- @focus="handleFocus"
                    @blur="handleBlur" -->
                <!-- :disabled="disabled"
                    :readonly="readonly"
                    :focused="focused" -->
            </div>

            <!-- Суффикс -->
            <!-- <div
                v-if="suffixIcon || suffixText"
                class="form-field__suffix"
                @click="suffixIcon ? handleIconClick('suffix') : undefined"
            >
                <Icon
                    v-if="suffixIcon"
                    :name="suffixIcon"
                    class="form-field__suffix-icon"
                />
                <span
                    v-if="suffixText"
                    class="form-field__suffix-text"
                >{{ suffixText }}</span>
            </div> -->
        </div>

        <!-- Сообщение об ошибке (атом) -->
        <div class="form-field__input-error">
            <ErrorMessage
                severity="error"
                variant="simple"
                size="sm"
            >{{ error }}</ErrorMessage>
        </div>

        <!-- Подсказка (атом) -->
        <!-- <HintText
            v-if="hasHint && !hasError"
            :text="hint"
            :error="hasError"
        /> -->

        <!-- Счетчик символов (атом) -->
        <!-- <CharacterCounter
            v-if="hasCounter"
            :current="currentLength"
            :max="maxLength!"
            :error="isCounterExceeded"
        /> -->
    </div>
</template>

<style scoped>
.form-field {
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &--error {
        color: var(--accent-error);
    }

    .form-field__wrapper {
        width: 100%;
        min-width: 0;
        display: flex;
    }

    .form-field__input-error {
        min-width: 0;
        line-height: 1rem;
        min-height: 1rem;
        overflow: hidden;
        contain: layout;


        .message {
            max-width: 100%;
            justify-content: start;
        }

        :deep([data-pc-section="text"]) {
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            min-width: 0;
            white-space: nowrap;

            /* TODO: сделать генерацию стилей для нескольких строк */
            /* display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            white-space: normal; */
        }
    }
}

/* // .form-field {
//     @apply w-full flex flex-col gap-2;
// }

// .form-field__wrapper {
//     @apply relative w-full;
// }

// .form-field__prefix,
// .form-field__suffix {
//     @apply absolute top-1/2 -translate-y-1/2 flex items-center text-gray-500 pointer-events-none;
// }

// .form-field__prefix {
//     @apply left-3;
// }

// .form-field__suffix {
//     @apply right-3 cursor-pointer;
// }

// .form-field__input-slot {
//     @apply w-full;
// }

// .form-field--disabled {
//     @apply opacity-60 cursor-not-allowed;
// }

// .form-field--readonly {
//     @apply opacity-80;
// }

// .form-field--sm {
//     @apply text-sm;
// }

// .form-field--md {
//     @apply text-base;
// }

// .form-field--lg {
//     @apply text-lg;
// } */
</style>