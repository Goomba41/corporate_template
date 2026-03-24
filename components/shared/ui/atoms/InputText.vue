<script
    setup
    lang="ts"
>
import { computed, useSlots } from 'vue'

// import Spinner from '~/assets/icons/spinnerDefault.svg?component';

interface Props {
    size?: 'sm' | 'md' | 'lg'
    placeholder?: string,
    invalid?: boolean
    fluid?: boolean,
    variant?: 'filled'
    disabled?: boolean
    loading?: boolean
}

// TODO: floatLabel (молекула), loading
const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    placeholder: undefined,
    invalid: undefined,
    fluid: undefined,
    variant: undefined,
    disabled: undefined,
    loading: undefined
})

// TODO: эмиты событий focus, blur, value-change, update:modelValue
// const emit = defineEmits<{ click: [] }>()

// const slots = useSlots()

const inputClasses = computed(() => ([
    'input-text',
    `input-text--${props.size}`,
    props.variant && `input-text--${props.variant}`,
    props.disabled && `input-text--${props.disabled}`,
    {
        'input-text--invalid': props.invalid === true,
        'input-text--fluid': props.fluid === true,
    }
]))
</script>

<template>
    <!-- :loading="loading" -->
    <input
        :disabled="disabled || loading"
        :placeholder="placeholder"
        :class="inputClasses"
    >
    <!-- <template #default>
            <slot />
        </template>

<template #loadingicon>
            <div
                v-if="$slots.loadingIcon"
                :class="['icon', `${iconPos}`]"
            >
                <slot name="loadingIcon"></slot>
            </div>
            <div
                v-else
                :class="['icon', `${iconPos}`]"
            >
                <Spinner />
            </div>
        </template>

<template
    v-if="$slots.icon"
    #icon
>
            <div :class="['icon', `${iconPos}`]">
                <slot name="icon"></slot>
            </div>
        </template> -->
    </input>
</template>

<style
    scoped
    lang="scss"
>
.input-text {
    display: block;
    box-sizing: border-box;

    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;

    color: var(--text-primary);
    background: var(--bg-primary);
    border: 1px solid var(--surface-300);
    border-radius: 0.5rem;
    outline-color: transparent;
    appearance: none;

    &:not(:disabled) {
        &:hover {
            border-color: var(--border-secondary);
            outline: 1px var(--p-inputtext-focus-ring-style) var(--primary-500);
        }

        &:focus {
            border-color: var(--primary-500);
            outline: 1px solid var(--primary-500);
        }
    }

    &--fluid {
        width: 100%;
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

        &:hover {
            border-color: color-mix(in srgb, var(--accent-error) 90%, var(--text-primary) 10%);
        }

        &::placeholder {
            color: var(--accent-error);
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
}

.mode-dark {
    .input-text {
        &--invalid:not(:disabled):hover {
            border-color: color-mix(in srgb, var(--accent-error) 80%, var(--text-primary) 20%);
        }
    }
}
</style>
