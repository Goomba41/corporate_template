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

const bem = appBEM('badge')

const badgeClasses = computed(() => bem({
    severity: props.severity,
    size: props.size,
    circle: props.circle || props.value.length < 2,
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

.hh-badge {
    display: inline-flex;
    border-radius: calc(var(--ui-radius) * 1.5);
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;

    &--size-sm {
        font-size: 0.625rem;
        min-width: 1.25rem;
        height: 1.25rem;
    }

    &--size-lg {
        font-size: 0.875rem;
        min-width: 1.75rem;
        height: 1.75rem;
    }

    &--size-xl {
        font-size: 1rem;
        min-width: 2rem;
        height: 2rem;
    }

    &--circle {
        padding: 0;
        border-radius: 50%;
    }

    &--severity-secondary {
            background-color: var(--bg-tertiary);
            outline-color: var(--text-primary);
    }

    @each $name, $color in $message-variants {
        &--severity-#{$name} {
            color: var(--text-inverse);
            background-color: $color;
        }
    }
}
</style>