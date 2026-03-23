<script
    setup
    lang="ts"
>
import { computed } from 'vue'

interface Props {
    value: string
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help'
    circle?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
    severity: 'primary',
    circle: false,
    size: 'md',
})

const badgeClasses = computed(() => ({
    'badge': true,
    'badge--primary': props.severity === 'primary',
    'badge--secondary': props.severity === 'secondary',
    'badge--success': props.severity === 'success',
    'badge--danger': ['danger', 'error'].includes(props.severity),
    'badge--info': props.severity === 'info',
    'badge--warning': props.severity === 'warning',
    'badge--help': props.severity === 'help',

    'badge--sm': props.size === 'sm',
    'badge--md': props.size === 'md',
    'badge--lg': props.size === 'lg',
    'badge--xl': props.size === 'xl',

    'badge--circle': props.circle && props.value.length < 2,
}))
</script>

<template>
    <span :class="badgeClasses">
        {{ value }}
    </span>
</template>

<style
    scoped
    lang="scss"
>
@use 'sass:list';

// Карта основных вариантов и их цветов
$message-variants: (
    success: var(--accent-success),
    warning: var(--accent-warning),
    danger: var(--accent-error),
    info: var(--accent-info),
    help: var(--accent-help),
    primary: var(--primary-600),
);

.badge {
    display: inline-flex;
    border-radius: 0.5rem;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;

    &--sm {
        font-size: 0.625rem;
        min-width: 1.25rem;
        height: 1.25rem;
    }

    &--lg {
        font-size: 0.875rem;
        min-width: 1.75rem;
        height: 1.75rem;
    }

    &--xl {
        font-size: 1rem;
        min-width: 2rem;
        height: 2rem;
    }

    &--circle {
        padding: 0;
        border-radius: 50%;
    }

    &.badge--secondary {
        background-color: var(--surface-200);
        outline-color: var(--surface-400);
    }

    @each $name, $color in $message-variants {
        &.badge--#{$name} {
            color: var(--text-inverse);
            background-color: $color;
        }
    }
}
</style>