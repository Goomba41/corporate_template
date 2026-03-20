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
}

// TODO: fluid, filled, disabled, invalid
const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    placeholder: undefined,
    invalid: undefined
})

// TODO: эмиты событий
// const emit = defineEmits<{ click: [] }>()

// const slots = useSlots()

const inputClasses = computed(() => ({
    'input-text': true,

    'input-text-sm': props.size === 'sm',
    'input-text-md': props.size === 'md',
    'input-text-lg': props.size === 'lg',

    'input-text-invalid': props.invalid === true
}))
</script>

<template>
    <!-- :label="label"
    :icon-pos="iconPos"
    :loading="loading"
    :disabled="disabled || loading" -->
    <PrimeInputText
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
    </PrimeInputText>
</template>

<style
    scoped
    lang="scss"
>
// TODO: БЭМ
.input-text {
    display: block;
    box-sizing: border-box;

    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;

    color: var(--text-primary);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
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

    // &.input-text-disabled {
    //     opacity: 60%;
    //     cursor: default;
    // }

    &.input-text-invalid {
        border-color: var(--accent-error);

        &:hover {
            border-color: color-mix(in srgb, var(--accent-error) 90%, var(--text-primary) 10%);
        }

        &::placeholder {
            color: var(--accent-error);
        }
    }

    &.input-text-sm {
        line-height: normal;
        font-size: 0.875rem;
        padding-inline: calc(var(--spacing) * 2.5); // px
        padding-block: calc(var(--spacing) * 1.5); // py
    }

    &.input-text-md {
        line-height: normal;
        font-size: 1rem;
        padding-inline: calc(var(--spacing) * 3); // px
        padding-block: calc(var(--spacing) * 2); // py
    }

    &.input-text-lg {
        line-height: normal;
        font-size: 1.125rem;
        padding-inline: calc(var(--spacing) * 3.5); // px
        padding-block: calc(var(--spacing) * 2.5); // py
    }
}

.mode-dark {
    .input-text-invalid:not(:disabled):hover {
        border-color: color-mix(in srgb, var(--accent-error) 80%, var(--text-primary) 20%);
    }
}
</style>
