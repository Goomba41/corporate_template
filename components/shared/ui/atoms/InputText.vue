<script
    setup
    lang="ts"
>
import { computed } from 'vue'

import type { InputProps as Props } from '~/types/input-props'

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    type: 'text'
})

const emit = defineEmits<{ 'input-change': [value: string] }>()

const handleChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    emit('input-change', value)
}

const input = ref<HTMLInputElement | null>(null)

defineExpose({
    internalInput: input,
    focus: () => input.value?.focus(),
    blur: () => input.value?.blur()
})

const model = defineModel<string>()

const bem = appBEM('input-text')

const inputClasses = computed(() => bem({
    size: props.size,
    variant: props.variant,
    disabled: props.disabled,
    loading: props.loading,
    invalid: props.invalid,
}))
</script>

<template>
    <div :class="bem('wrapper', { 'fluid': props.fluid })">
        <input
            ref="input"
            v-model="model"
            :type="type"
            :disabled="disabled || loading"
            :placeholder="placeholder"
            :class="inputClasses"
            @change="handleChange"
        >

        <Transition
            name="fade"
            mode="out-in"
        >
            <div
                v-if="loading"
                :class="bem('loading-icon')"
            >
                <slot name="loadingIcon">
                    <IconUiSpinnerDefault />
                </slot>
            </div>
        </Transition>
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

.hh-input-text {
    $loading-icon-padding: 2rem;
    $loading-icon-width: 1.25rem;

    width: 100%;

    display: block;
    box-sizing: border-box;

    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;

    color: var(--text-primary);
    background: var(--bg-primary);
    border: 1px solid var(--border-secondary);
    border-radius: inherit;
    outline-color: transparent;
    appearance: none;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px var(--bg-primary) inset !important;
        /* Цвет вашего фона */
        -webkit-text-fill-color: var(--text-primary);
        /* Цвет вашего текста */
        transition: background-color 5000s ease-in-out 0s;
    }

    &:not(:disabled) {
        &:hover {
            border-color: var(--border-secondary);
            outline: 1px solid var(--primary-500);
        }

        &:focus {
            border-color: var(--primary-500);
            outline: 1px solid var(--primary-500);
        }
    }

    &--variant-filled {
        background-color: var(--surface-100);
    }

    &--disabled,
    &:disabled {
        opacity: 1;
        background-color: var(--border-primary);
        color: var(--text-secondary);
        cursor: default;
    }

    &--invalid {
        border-color: var(--accent-error);

        &:not(:hover):not(:focus)::placeholder {
            color: var(--accent-error);
        }

        &:hover {
            border-color: var(--border-secondary);
        }
    }

    &--size-sm {
        line-height: normal;
        font-size: 0.875rem;
        padding-inline: calc(var(--spacing) * 2.5); // px
        padding-block: calc(var(--spacing) * 1.5); // py
    }

    &--size-md {
        line-height: normal;
        font-size: 1rem;
        padding-inline: calc(var(--spacing) * 3); // px
        padding-block: calc(var(--spacing) * 2); // py
    }

    &--size-lg {
        line-height: normal;
        font-size: 1.125rem;
        padding-inline: calc(var(--spacing) * 3.5); // px
        padding-block: calc(var(--spacing) * 2.5); // py
    }

    &--loading {
        padding-right: $loading-icon-padding;
    }

    &__loading-icon {
        position: absolute;
        border-radius: 100%;
        display: flex;
        justify-content: center;

        top: 50%;
        transform: translateY(-50%);
        right: math.div($loading-icon-padding - $loading-icon-width, 2);

        svg {
            width: $loading-icon-width;
        }
    }

    &__wrapper {
        display: flex;
        position: relative;
        border-radius: 0.5rem;

        &--fluid {
            width: 100%;
        }
    }
}

.mode-dark .hh-input-text {
    background: var(--bg-secondary);

    &--variant-filled {
        background-color: var(--bg-primary);
    }

    &--disabled,
    &:disabled {
        background-color: var(--surface-700);
    }
}
</style>
