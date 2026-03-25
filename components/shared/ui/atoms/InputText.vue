<script
    setup
    lang="ts"
>
import { computed } from 'vue'

interface Props {
    size?: 'sm' | 'md' | 'lg'
    placeholder?: string,
    invalid?: boolean
    fluid?: boolean,
    variant?: 'filled'
    disabled?: boolean
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md'
})

const emit = defineEmits<{ 'input-change': [value: string] }>()

const handleChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    emit('input-change', value)
}

const model = defineModel<string>()

const inputClasses = computed(() => ([
    'input-text',
    `input-text--${props.size}`,
    props.variant && `input-text--${props.variant}`,
    {
        'input-text--disabled': props.disabled,
        'input-text--loading': props.loading,
        'input-text--invalid': props.invalid,
    }
]))
</script>

<template>
    <div
        class="input-text__wrapper"
        :class="{ 'input-text__wrapper--fluid': props.fluid }"
    >
        <input
            v-model="model"
            type="text"
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
                class="input-text__loading-icon"
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

.input-text__wrapper {
    display: flex;
    position: relative;
    border-radius: 0.5rem;

    &--fluid {
        width: 100%;
    }

    .input-text {
        width: 100%;

        display: block;
        box-sizing: border-box;

        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;

        color: var(--text-primary);
        background: var(--bg-primary);
        border: 1px solid var(--surface-300);
        border-radius: inherit;
        outline-color: transparent;
        appearance: none;

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

        &--filled {
            background-color: var(--surface-50);
        }

        &--disabled,
        &:disabled {
            opacity: 1;
            background-color: var(--surface-200);
            color: var(--surface-500);
            cursor: default;
        }

        &--invalid {
            border-color: var(--accent-error);

            &:not(:hover):not(:focus)::placeholder {
                color: var(--accent-error);
            }

            &:hover {
                border-color: color-mix(in srgb, var(--accent-error) 90%, var(--text-primary) 10%);
            }

        }

        &--sm {
            line-height: normal;
            font-size: 0.875rem;
            padding-inline: calc(var(--spacing) * 2.5); // px
            padding-block: calc(var(--spacing) * 1.5); // py
        }

        &--md {
            line-height: normal;
            font-size: 1rem;
            padding-inline: calc(var(--spacing) * 3); // px
            padding-block: calc(var(--spacing) * 2); // py
        }

        &--lg {
            line-height: normal;
            font-size: 1.125rem;
            padding-inline: calc(var(--spacing) * 3.5); // px
            padding-block: calc(var(--spacing) * 2.5); // py
        }

        $loading-icon-padding: 2rem;
        $loading-icon-width: 1.25rem;

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
    }
}


.mode-dark {
    .input-text {
        &--invalid:not(:disabled):hover {
            border-color: color-mix(in srgb, var(--accent-error) 80%, var(--text-primary) 20%);
        }

        &--filled {
            background-color: var(--surface-800);
        }

        &--disabled,
        &:disabled {
            // color: 
            background-color: var(--surface-700);
        }
    }
}
</style>
