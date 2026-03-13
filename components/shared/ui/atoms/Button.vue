<script
    setup
    lang="ts"
>
import Spinner from '~/assets/icons/spinnerDefault.svg?component';

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
}

const props = withDefaults(defineProps<Props>(), {
    severity: 'primary',
    variant: undefined,
    size: 'md',
    loading: false,
    disabled: false,
    iconPos: 'left',
    rounded: false,
})

const emit = defineEmits<{ click: [] }>()


// TODO: icon, icon-only, button-group, badge
</script>

<template>
    <PrimeButton
        :label="label ?? $t('button.label.default')"
        :icon="icon"
        :icon-pos="iconPos"
        :loading="loading"
        :disabled="disabled || loading"
        :class="[
            'btn',
            {
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

                'btn-rounded': rounded,

                'btn-disabled': disabled || loading
            },
        ]"
        @click="emit('click')"
    >
        <template #default>
            <slot />
        </template>
        <template #loadingicon>
            <slot v-if="$slots.loadingIcon" name="loadingIcon"></slot>
            <div v-else><Spinner height="1.25em" width="1.25em" /></div>
        </template>
        <!-- TODO: сделать слот иконки -->
        <!-- <template #icon>
            <slot name="icon"></slot>
        </template> -->
    </PrimeButton>
</template>

<style
    scoped
    lang="scss"
>
// Карта основных вариантов кнопок и их цветов
$btn-variants: (
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
@mixin btn-solid-hover($color) {
    $mixed: color-mix(in srgb, $color 80%, var(--text-primary) 20%);
    background-color: $mixed;
    border-color: $mixed;
}

// Миксин для hover фона outlined/text кнопок
@mixin btn-outline-hover($color) {
    background-color: color-mix(in srgb, $color 10%, var(--text-inverse) 90%);
}

// Миксин для hover border text кнопок
@mixin btn-text-border-hover($color) {
    border-color: color-mix(in srgb, $color 10%, var(--text-inverse) 90%);
}

.btn {
    color: var(--text-inverse);
    border-radius: 0.5rem;
    font-weight: 500;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    border-width: 1px;

    &.btn-rounded {
        border-radius: 2rem;
    }

    &.btn-disabled {
        opacity: 60%;
        cursor: default;
    }

    &.btn-sm {
        line-height: normal;
        font-size: 0.875rem;
        padding-inline: calc(var(--spacing) * 2.5); // px
        padding-block: calc(var(--spacing) * 1.5); // py
    }

    &.btn-md {
        line-height: normal;
        font-size: 1rem;
        padding-inline: calc(var(--spacing) * 3); // px
        padding-block: calc(var(--spacing) * 2); // py
    }

    &.btn-lg {
        line-height: normal;
        font-size: 1.125rem;
        padding-inline: calc(var(--spacing) * 3.5); // px
        padding-block: calc(var(--spacing) * 2.5); // py
    }

    &.btn-primary {
        background-color: var(--primary-600);
        border-color: var(--primary-600);

        &:not(:disabled):hover {
            background-color: var(--primary-700);
            border-color: var(--primary-700);
        }
    }

    &.btn-secondary {
        background-color: var(--surface-200);
        border-color: var(--surface-200);

        &:not(:disabled):hover {
            background-color: var(--surface-300);
            border-color: var(--surface-300);
        }
    }

    @each $name, $color in $btn-variants {
        &.btn-#{$name} {
            background-color: $color;
            border-color: $color;
        }
    }

    &.btn-outlined,
    &.btn-text {
        background: transparent;

        // Генерация цветов и hover фона для основных вариантов
        @each $name, $color in $btn-variants {
            &.btn-#{$name} {
                color: $color;

                &:not(:disabled):hover {
                    @include btn-outline-hover($color);
                }
            }
        }

        // Secondary variant (использует другие переменные для hover)
        &.btn-secondary {
            color: var(--surface-500);
            background-color: transparent;

            &:not(:disabled):hover {
                @include btn-outline-hover(var(--surface-400));
            }
        }
    }

    &.btn-text {
        border-color: transparent;
    }

    // Генерация hover состояний для solid кнопок
    @each $name, $color in $solid-variants {
        &.btn-#{$name}:not(:disabled):hover {
            @include btn-solid-hover($color);
        }
    }

    &.btn-secondary {
        color: var(--text-primary);
    }
}

.btn-text {

    // Генерация hover border для text кнопок
    @each $name, $color in $btn-variants {
        &.btn-#{$name}:not(:disabled):hover {
            @include btn-text-border-hover($color);
        }
    }

    // Secondary variant для text кнопок
    &.btn-secondary {
        border-color: transparent;

        &:not(:disabled):hover {
            @include btn-text-border-hover(var(--surface-400));
        }
    }
}

.mode-dark {
    .btn-secondary {
        background-color: var(--surface-500);
        border-color: var(--surface-500);

        &.btn-text {
            border-color: transparent
        }

        &:not(:disabled):hover {
            border-color: var(--surface-500);
            background-color: var(--surface-400);
        }

        &.btn-text:not(:disabled):hover {
            border-color: color-mix(in srgb, var(--surface-500) 10%, var(--text-inverse) 90%);
        }
    }

    .btn-primary:not(:disabled):hover {
        background-color: var(--primary-500);
    }
}
</style>