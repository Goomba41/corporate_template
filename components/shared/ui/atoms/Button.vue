<script
    setup
    lang="ts"
>
import { computed, useSlots } from 'vue'

interface Props {
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help'
    variant?: "outlined" | "text" | "link"
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

const bem = appBEM('button')

const buttonClasses = computed(() => bem({
    severity: props.severity,
    size: props.size,
    variant: props.variant,
    rounded: props.rounded,
    disabled: props.disabled || props.loading,
    vertical: ['top', 'bottom'].includes(props.iconPos),
    'icon-only': props.label === undefined && !!slots.icon
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
            :class="bem('label')"
        >
            {{ label }}
        </span>

        <slot />

        <template v-if="loading">
            <div
                v-if="$slots.loadingIcon"
                :class="bem('icon', { position: iconPos })"
            >
                <slot name="loadingIcon"></slot>
            </div>
            <div
                v-else
                :class="bem('icon', { position: iconPos })"
            >
                <IconUiSpinnerDefault />
            </div>
        </template>

        <template v-if="!loading && $slots.icon">
            <div :class="bem('icon', { position: iconPos })">
                <slot name="icon"></slot>
            </div>
        </template>

        <!-- Бейдж -->
        <AtomBadge
            v-if="!loading && badge"
            :class="bem('badge')"
            :value="badge"
            :severity="badgeSeverity"
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
    background-color: color-mix(in srgb, $color 20%, var(--text-inverse) 80%);
}

// Миксин для hover border text кнопок
@mixin button-text-border-hover($color) {
    border-color: color-mix(in srgb, $color 20%, var(--text-inverse) 80%);
}

.hh-button {
    color: var(--text-inverse);
    border-radius: calc(var(--ui-radius) * 1.5);
    font-weight: 500;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    border-width: 1px;

    &__label {
        order: 1;
    }

    &__badge {
        order: 3;
        height: 1rem;
        line-height: 1rem;
        min-width: 1rem;
        font-size: 0.625rem;
    }

    &__icon {
        height: 1.25em;
        width: 1.25em;
        order: 2;

        &--position-left,
        &--position-top {
            order: 0
        }

        :deep(svg) {
            width: 100%;
            height: 100%;
            /* опционально, убирает лишние отступы */
            display: block;
        }
    }

    &--vertical {
        flex-direction: column;
    }

    &--rounded {
        border-radius: 2rem;
    }

    &--disabled {
        opacity: 60%;
        cursor: default;
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

    &--icon-only {
        padding-inline: 0;
        gap: 0;
    }

    &--icon-only#{&}--size-sm {
        width: calc(var(--spacing) * 7.95);
    }

    &--icon-only#{&}--size-md {
        width: calc(var(--spacing) * 9.575);
    }

    &--icon-only#{&}--size-lg {
        width: calc(var(--spacing) * 11.2);
    }

    &--severity-primary {
        background-color: var(--primary-600);
        border-color: var(--primary-600);

        &:not(:disabled):hover {
            background-color: var(--primary-700);
            border-color: var(--primary-700);
        }
    }

    :where(.mode-dark) &--severity-primary:not(:disabled):hover {
        background-color: var(--primary-500);
        border-color: var(--primary-500);
    }

    &--severity-secondary {
        background-color: var(--bg-tertiary);
        border-color: var(--bg-tertiary);

        &:not(:disabled):hover {
            background-color: var(--border-secondary);
            border-color: var(--bg-tertiary);
        }
    }

    @each $name, $color in $button-variants {
        &--severity-#{$name} {
            background-color: $color;
            border-color: $color;
        }
    }

    &--variant-outlined,
    &--variant-text,
    &--variant-link {
        background: transparent;
    }

    // Генерация цветов и hover фона для основных вариантов
    @each $name, $color in $button-variants {

        &--variant-outlined#{&}--severity-#{$name},
        &--variant-text#{&}--severity-#{$name},
        &--variant-link#{&}--severity-#{$name} {
            color: $color;
        }

        &--variant-outlined#{&}--severity-#{$name},
        &--variant-text#{&}--severity-#{$name} {
            &:not(:disabled):hover {
                @include button-outline-hover($color);
            }
        }

        &--variant-text#{&}--severity-#{$name} {
            &:not(:disabled):hover {
                @include button-text-border-hover($color);
            }
        }

        &--variant-link#{&}--severity-#{$name} {
            &:not(:disabled):hover {
                color: color-mix(in srgb, $color 60%, var(--text-primary) 40%);
                background: transparent;
                border-color: transparent;
                // text-decoration: underline;
                // text-decoration-style: dashed;
                // text-underline-offset: 3px;
                // text-decoration-thickness: 1px;
            }
        }
    }

    // Secondary variant (использует другие переменные для hover)
    &--variant-outlined#{&}--severity-secondary,
    &--variant-text#{&}--severity-secondary {
        color: var(--surface-500);
        background-color: transparent;

        &:not(:disabled):hover {
            @include button-outline-hover(var(--surface-400));
        }
    }

    &--variant-text#{&}--severity-secondary {
        &:not(:disabled):hover {
            @include button-text-border-hover(var(--surface-400));
        }
    }


    &--variant-text,
    &--variant-link {
        border-color: transparent;
    }

    &--variant-link {
        padding: 0;
    }

    // Генерация hover состояний для solid кнопок
    @each $name, $color in $solid-variants {
        &--severity-#{$name}:not(:disabled):hover {
            @include button-solid-hover($color);
        }
    }

    &--severity-secondary {
        color: var(--text-primary);
    }
}
</style>