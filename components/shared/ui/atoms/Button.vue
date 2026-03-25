<script
    setup
    lang="ts"
>
import { computed, useSlots } from 'vue'

interface Props {
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help'
    variant?: "outlined" | "text"
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    iconPos?: 'left' | 'right' | 'top' | 'bottom'
    label?: string
    rounded?: boolean
    badge?: string
    badgeSeverity?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help'
}

const props = withDefaults(defineProps<Props>(), {
    severity: 'primary',
    variant: undefined,
    size: 'md',
    loading: false,
    disabled: false,
    iconPos: 'left',
    rounded: false,
    badgeSeverity: 'info'
})

const emit = defineEmits<{ click: [] }>()

const slots = useSlots()

const buttonClasses = computed(() => ({
    'button': true,
    'button--primary': props.severity === 'primary',
    'button--secondary': props.severity === 'secondary',
    'button--success': props.severity === 'success',
    'button--danger': props.severity === 'danger',
    'button--info': props.severity === 'info',
    'button--warning': props.severity === 'warning',
    'button--help': props.severity === 'help',

    'button--sm': props.size === 'sm',
    'button--md': props.size === 'md',
    'button--lg': props.size === 'lg',

    'button--outlined': props.variant === 'outlined',
    'button--text': props.variant === 'text',

    'button--rounded': props.rounded,

    'button--disabled': props.disabled || props.loading,

    'button--vertical': ['top', 'bottom'].includes(props.iconPos),
    'button--icon-only': props.label === undefined && !!slots.icon
}))
</script>

<template>
    <button
        :disabled="disabled"
        :class="buttonClasses"
        @click="emit('click')"
    >
        <span
            v-if="label"
            class="button__label"
        >
            {{ label }}
        </span>

        <slot />

        <template v-if="loading">
            <div
                v-if="$slots.loadingIcon"
                :class="['button__icon', `button__icon--${iconPos}`]"
            >
                <slot name="loadingIcon"></slot>
            </div>
            <div
                v-else
                :class="['button__icon', `button__icon--${iconPos}`]"
            >
                <IconUiSpinnerDefault />
            </div>
        </template>

        <template v-if="!loading && $slots.icon">
            <div :class="['button__icon', `button__icon--${iconPos}`]">
                <slot name="icon"></slot>
            </div>
        </template>

        <!-- Бейдж -->
        <AtomBadge
            v-if="!loading && badge"
            class="button__badge"
            :value="badge"
            :severity="badgeSeverity"
            :circle="true"
        ></AtomBadge>
    </button>
</template>

<style
    scoped
    lang="scss"
>
// Карта основных вариантов кнопок и их цветов
$button-variants: (
    success: var(--accent-success),
    warning: var(--accent-warning),
    danger: var(--accent-error),
    info: var(--accent-info),
    help: var(--accent-help),
    primary: var(--primary-600),
);

// Варианты для solid кнопок (без primary и secondary)
$solid-variants: (
    success: var(--accent-success),
    warning: var(--accent-warning),
    danger: var(--accent-error),
    info: var(--accent-info),
    help: var(--accent-help),
);

// Миксин для hover эффекта solid кнопок
@mixin button-solid-hover($color) {
    $mixed: color-mix(in srgb, $color 80%, var(--text-primary) 20%);
    background-color: $mixed;
    border-color: $mixed;
}

// Миксин для hover фона outlined/text кнопок
@mixin button-outline-hover($color) {
    background-color: color-mix(in srgb, $color 10%, var(--text-inverse) 90%);
}

// Миксин для hover border text кнопок
@mixin button-text-border-hover($color) {
    border-color: color-mix(in srgb, $color 10%, var(--text-inverse) 90%);
}

.button {
    color: var(--text-inverse);
    border-radius: 0.5rem;
    font-weight: 500;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    border-width: 1px;

    .button__label {
        order: 1;
    }

    .button__badge {
        order: 3;
        height: 1rem;
        line-height: 1rem;
        min-width: 1rem;
        font-size: 0.625rem;
    }

    .button__icon {
        height: 1.25em;
        width: 1.25em;
        order: 2;

        &--left,
        &--top {
            order: 0
        }

        :deep(svg) {
            width: 100%;
            height: 100%;
            /* опционально, убирает лишние отступы */
            display: block;
        }
    }


    &.button--vertical {
        flex-direction: column;
    }

    &.button--rounded {
        border-radius: 2rem;
    }

    &.button--disabled {
        opacity: 60%;
        cursor: default;
    }

    &.button--sm {
        line-height: normal;
        font-size: 0.875rem;
        padding-inline: calc(var(--spacing) * 2.5); // px
        padding-block: calc(var(--spacing) * 1.5); // py
    }

    &.button--md {
        line-height: normal;
        font-size: 1rem;
        padding-inline: calc(var(--spacing) * 3); // px
        padding-block: calc(var(--spacing) * 2); // py
    }

    &.button--lg {
        line-height: normal;
        font-size: 1.125rem;
        padding-inline: calc(var(--spacing) * 3.5); // px
        padding-block: calc(var(--spacing) * 2.5); // py
    }

    &.button--icon-only {

        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;

        &.button--sm {
            width: calc(var(--spacing) * 7.95);
        }

        &.button--md {
            width: calc(var(--spacing) * 9.575);
        }

        &.button--lg {
            width: calc(var(--spacing) * 11.2);
        }
    }

    &.button--primary {
        background-color: var(--primary-600);
        border-color: var(--primary-600);

        &:not(:disabled):hover {
            background-color: var(--primary-700);
            border-color: var(--primary-700);
        }
    }

    &.button--secondary {
        background-color: var(--surface-200);
        border-color: var(--surface-200);

        &:not(:disabled):hover {
            background-color: var(--surface-300);
            border-color: var(--surface-300);
        }
    }

    @each $name, $color in $button-variants {
        &.button--#{$name} {
            background-color: $color;
            border-color: $color;
        }
    }

    &.button--outlined,
    &.button--text {
        background: transparent;

        // Генерация цветов и hover фона для основных вариантов
        @each $name, $color in $button-variants {
            &.button--#{$name} {
                color: $color;

                &:not(:disabled):hover {
                    @include button-outline-hover($color);
                }
            }
        }

        // Secondary variant (использует другие переменные для hover)
        &.button--secondary {
            color: var(--surface-500);
            background-color: transparent;

            &:not(:disabled):hover {
                @include button-outline-hover(var(--surface-400));
            }
        }
    }

    &.button--text {
        border-color: transparent;
    }

    // Генерация hover состояний для solid кнопок
    @each $name, $color in $solid-variants {
        &.button--#{$name}:not(:disabled):hover {
            @include button-solid-hover($color);
        }
    }

    &.button--secondary {
        color: var(--text-primary);
    }
}

.button--text {

    // Генерация hover border для text кнопок
    @each $name, $color in $button-variants {
        &.button--#{$name}:not(:disabled):hover {
            @include button-text-border-hover($color);
        }
    }

    // Secondary variant для text кнопок
    &.button--secondary {
        border-color: transparent;

        &:not(:disabled):hover {
            @include button-text-border-hover(var(--surface-400));
        }
    }
}

.mode-dark {
    .button--secondary {
        background-color: var(--surface-500);
        border-color: var(--surface-500);

        &.button--text {
            border-color: transparent
        }

        &:not(:disabled):hover {
            border-color: var(--surface-500);
            background-color: var(--surface-400);
        }

        &.button--text:not(:disabled):hover {
            border-color: color-mix(in srgb, var(--surface-500) 10%, var(--text-inverse) 90%);
        }
    }

    .button--primary:not(:disabled):hover {
        background-color: var(--primary-500);
    }
}
</style>