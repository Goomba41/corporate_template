<script
    setup
    lang="ts"
>
import { computed } from 'vue'
import ErrorMessage from '~/components/shared/ui/atoms/Message.vue'
// import HintText from '~/components/shared/ui/atoms/HintText.vue'
// import CharacterCounter from '~/components/shared/ui/atoms/CharacterCounter.vue'

interface Props {
    // label?: string
    error?: string | null
    errorLines?: number
    // hint?: string
    // required?: boolean
    // disabled?: boolean
    // readonly?: boolean
    // focused?: boolean
    // maxLength?: number
    // modelValue?: string | number
    // showCounter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    // label: '',
    error: null,
    errorLines: 1
    // hint: '',
    // required: false,
    // disabled: false,
    // readonly: false,
    // focused: false,
    // maxLength: undefined,
    // modelValue: '',
    // showCounter: false,
})

const emit = defineEmits<{
    focus: []
    blur: []
    iconClick: [position: 'prefix' | 'suffix']
}>()

const bem = appBEM('form-field')

const hasError = computed(() => !!props.error)
// const hasHint = computed(() => !!props.hint)
// const hasCounter = computed(() => props.showCounter && props.maxLength)
// const currentLength = computed(() => {
//     if (typeof props.modelValue === 'string') {
//         return props.modelValue.length
//     }
//     return 0
// })
// const isCounterExceeded = computed(() => {
//     if (!props.maxLength) return false
//     return currentLength.value > props.maxLength
// })

const handleFocus = () => emit('focus')
const handleBlur = () => emit('blur')
</script>

<template>
    <div
        class="form-field"
        :class="bem({
            error: hasError,
            // 'disabled': disabled,
            // 'readonly': readonly,
            // 'focused': focused
            // `form-field--${variant}`,
            // `form-field--${size}`,
        })"
    >
        <!-- Обертка для поля ввода -->
        <!-- Слот для поля ввода -->
        <div :class="bem('input-slot')">
            <slot
                class="w-full"
                name="input"
                :invalid="hasError"
            />
            <!-- @focus="handleFocus"
                    @blur="handleBlur" -->
            <!-- :disabled="disabled"
                    :readonly="readonly"
                    :focused="focused" -->
        </div>

        <!-- Сообщение об ошибке (атом) -->
        <div
            :class="bem('input-error', { multiline: errorLines > 1 })"
            :style="errorLines ? { '--error-lines': errorLines } : undefined"
        >
            <ErrorMessage
                severity="error"
                variant="simple"
                size="sm"
            >{{ error }}</ErrorMessage>
        </div>

        <!-- TODO: атом подсказки -->
        <!-- Подсказка (атом) -->
        <!-- <HintText
            v-if="hasHint && !hasError"
            :text="hint"
            :error="hasError"
        /> -->

        <!-- TODO: атом счётчика символов -->
        <!-- Счетчик символов (атом) -->
        <!-- <CharacterCounter
            v-if="hasCounter"
            :current="currentLength"
            :max="maxLength!"
            :error="isCounterExceeded"
        /> -->
    </div>
</template>

<style
    scoped
    lang="scss"
>
.hh-form-field {
    min-width: 0;
    display: flex;
    flex-direction: column;

    &--error {
        color: var(--accent-error);
    }

    &__input-slot {
        padding: 1px;

        &>*:first-child {
            width: 100%;
        }
    }

    &__input-error {
        min-width: 0;
        line-height: 1rem;
        min-height: 1rem;
        overflow: hidden;
        contain: layout;

        .hh-message {
            max-width: 100%;
            justify-content: start;

            :deep(.hh-message__text) {
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
                min-width: 0;
                white-space: nowrap;
            }
        }

        &--multiline .hh-message :deep(.hh-message__text) {
            white-space: normal;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: var(--error-lines, 2);
            line-clamp: var(--error-lines, 2);
        }
    }
}
</style>