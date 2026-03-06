<script setup lang="ts">
interface Props {
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help'
    variant?: "outlined" | "text",
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    icon?: string
    iconPos?: 'left' | 'right'
    label?: string
    rounded?: boolean
    fullWidth?: boolean
    pill?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    severity: 'primary',
    variant: undefined,
    size: 'md',
    loading: false,
    disabled: false,
    iconPos: 'left',
    rounded: false,
    fullWidth: false,
    pill: false
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
    <PrimeButton :label="label" :icon="icon" :icon-pos="iconPos" :loading="loading" :disabled="disabled" :class="[
        'btn',
        {
            // ⭐ СТАТИЧЕСКИЕ СТРОКИ - UnoCSS их увидит!
            'btn-primary': severity === 'primary',
            'btn-secondary': severity === 'secondary',
            'btn-success': severity === 'success',
            'btn-danger': severity === 'danger',
            'btn-info': severity === 'info',
            'btn-warning': severity === 'warning',
            'btn-help': severity === 'help',

            'btn-sm': size === 'sm',
            'btn-md': size === 'md',
            'btn-lg': size === 'lg',

            'btn-outlined': variant === 'outlined',
            'btn-text': variant === 'text',

            'rounded-full': pill,
            'rounded-lg': rounded && !pill,
            'w-full': fullWidth,
            'opacity-50 cursor-not-allowed': disabled
        },
    ]
        " @click="emit('click')">
        <slot />
    </PrimeButton>
</template>

<style scoped lang="scss">
.btn {
    &.btn-success:hover {
        background-color: color-mix(in srgb, var(--accent-success) 90%, black 10%);
        border-color: color-mix(in srgb, var(--accent-success) 90%, black 10%);
    }


    &.btn-warning:hover {
        background-color: color-mix(in srgb, var(--accent-warning) 90%, black 10%);
        border-color: color-mix(in srgb, var(--accent-warning) 90%, black 10%);
    }


    &.btn-danger:hover {
        background-color: color-mix(in srgb, var(--accent-error) 90%, black 10%);
        border-color: color-mix(in srgb, var(--accent-error) 90%, black 10%);
    }


    &.btn-info:hover {
        background-color: color-mix(in srgb, var(--accent-info) 90%, black 10%);
        border-color: color-mix(in srgb, var(--accent-info) 90%, black 10%);
    }


    &.btn-help:hover {
        background-color: color-mix(in srgb, var(--accent-help) 90%, black 10%);
        border-color: color-mix(in srgb, var(--accent-help) 90%, black 10%);
    }
}

.btn-outlined,
.btn-text {
    &.btn-success {
        color: var(--accent-success);

        &:hover {
            background-color: color-mix(in srgb, var(--accent-success) 10%, white 90%);
        }
    }

    &.btn-warning {
        color: var(--accent-warning);

        &:hover {
            background-color: color-mix(in srgb, var(--accent-warning) 10%, white 90%);
        }
    }

    &.btn-danger {
        color: var(--accent-error);

        &:hover {
            background-color: color-mix(in srgb, var(--accent-error) 10%, white 90%);
        }
    }

    &.btn-info {
        color: var(--accent-info);

        &:hover {
            background-color: color-mix(in srgb, var(--accent-info) 10%, white 90%);
        }
    }

    &.btn-help {
        color: var(--accent-help);

        &:hover {
            background-color: color-mix(in srgb, var(--accent-help) 10%, white 90%);
        }
    }

    &.btn-primary {
        color: var(--primary-600);

        &:hover {
            background-color: color-mix(in srgb, var(--primary-600) 10%, white 90%);
        }
    }

    &.btn-secondary {
        color: var(--secondary-600);

        &:hover {
            background-color: color-mix(in srgb, var(--secondary-600) 10%, white 90%);
        }
    }
}

.btn-text {
    &.btn-success:hover {
        border-color: color-mix(in srgb, var(--accent-success) 10%, white 90%);
    }


    &.btn-warning:hover {
        border-color: color-mix(in srgb, var(--accent-warning) 10%, white 90%);
    }


    &.btn-danger:hover {
        border-color: color-mix(in srgb, var(--accent-error) 10%, white 90%);
    }


    &.btn-info:hover {
        border-color: color-mix(in srgb, var(--accent-info) 10%, white 90%);
    }


    &.btn-help:hover {
        border-color: color-mix(in srgb, var(--accent-help) 10%, white 90%);
    }


    &.btn-primary:hover {
        border-color: color-mix(in srgb, var(--primary-600) 10%, white 90%);
    }


    &.btn-secondary:hover {
        border-color: color-mix(in srgb, var(--secondary-600) 10%, white 90%);
    }
}
</style>