<script
    setup
    lang="ts"
>
import { computed } from 'vue'

interface Props {
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'help' | 'error'
    variant?: "outlined" | "simple"
    size?: 'sm' | 'md' | 'lg'
    life?: number
    appearance?: 'top-bottom' | 'bottom-top' | 'left-right' | 'right-left' | 'left' | 'right' | 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
    severity: 'primary',
    variant: undefined,
    life: undefined,
    appearance: 'bottom-top'
})

const emit = defineEmits(['lifeEnd', 'close'])

const bem = appBEM('message')
const messageTransitionName = block('message-slide-fade')({
    appearance: props.appearance
}).split(' ')[1]

const messageClasses = computed(() =>
    bem({
        severity: props.severity,
        variant: props.variant,
        size: props.size,
    })
)

// Локальное состояние видимости
const visible = defineModel<boolean>('visible', { default: true })

let lifeTimer: ReturnType<typeof setTimeout> | null = null

const clearLifeTimer = () => {
    if (lifeTimer) {
        clearTimeout(lifeTimer)
        lifeTimer = null
    }
}

const setupLifeTimer = () => {
    clearLifeTimer()
    // Таймер ставим только если есть life И сообщение видимо
    if (props.life && visible.value) {
        lifeTimer = setTimeout(() => {
            visible.value = false
            emit('lifeEnd')
        }, props.life)
    }
}

watch([() => props.life, visible], setupLifeTimer, { immediate: true })

onBeforeUnmount(clearLifeTimer)
</script>

<template>
    <Transition
        :name="messageTransitionName"
        mode="out-in"
    >
        <div
            v-if="visible"
            :class="messageClasses"
        >
            <div :class="bem('content-wrapper')">
                <div :class="bem('content')">
                    <template v-if="$slots.icon">
                        <div :class="bem('icon')">
                            <slot name="icon"></slot>
                        </div>
                    </template>

                    <div :class="bem('text')">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
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
    error: var(--accent-error),
    info: var(--accent-info),
    help: var(--accent-help),
    primary: var(--primary-600),
);

$message-appearance-variants: (
    'top-bottom': (translateY(-10px), translateY(10px)),
    'bottom-top': (translateY(10px), translateY(-10px)),
    'left-right': (translateX(-10px), translateX(10px)),
    'right-left': (translateX(10px), translateX(-10px)),
    'top': (translateY(-5px), translateY(5px)),
    'bottom': (translateY(5px), translateY(-5px)),
    'left': (translateX(-5px), translateX(5px)),
    'right': (translateX(5px), translateX(-5px)),
);

@each $name, $transforms in $message-appearance-variants {
    $enter-transform: list.nth($transforms, 1);
    $leave-transform: list.nth($transforms, 2);

    .message-slide-fade {
        &--appearance-#{$name} {

            &-enter-active,
            &-leave-active {
                transition:
                    opacity 0.25s ease-out,
                    transform 0.25s ease-out;
                will-change: opacity, transform; // оптимизация для GPU
            }

            &-enter-from {
                opacity: 0;
                transform: $enter-transform;
            }

            &-leave-to {
                opacity: 0;
                transform: $leave-transform;
            }
        }
    }
}

@at-root {
    .mode-dark {
        .hh-message {
            &--severity-secondary {
                background-color: var(--surface-800);
                outline-color: var(--surface-600);
            }            
        }
    }
}

.hh-message {
    --message-padding-y: calc(var(--spacing) * 2);
    --message-padding-x: calc(var(--spacing) * 3);
    --message-font-size: 1rem;

    color: var(--text-inverse);
    border-radius: calc(var(--ui-radius) * 1.5);
    font-weight: 500;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    outline-width: 1px;
    outline-style: solid;
    line-height: normal;

    &__content-wrapper {
        max-width: 100%;
        min-height: 0;
    }

    &__content {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 2);
        padding: var(--message-padding-y) var(--message-padding-x);
    }

    &__text {
        font-size: var(--message-font-size);
    }

    &__icon {
        display: flex;
        align-items: center;

        svg {
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    // Модификаторы размера (формат: --size-*)
    &--size-sm {
        --message-padding-y: calc(var(--spacing) * 1.5);
        --message-padding-x: calc(var(--spacing) * 2.5);
        --message-font-size: 0.875rem;
    }

    &--size-lg {
        --message-padding-y: calc(var(--spacing) * 2.5);
        --message-padding-x: calc(var(--spacing) * 3.5);
        --message-font-size: 1.125rem;
    }

    @each $name, $color in $message-variants {
        &--severity-#{$name} {
            color: $color;
            background-color: color-mix(in srgb, $color, transparent 90%);
            outline-color: color-mix(in srgb, $color, transparent 75%);
        }
    }

    &--variant-outlined,
    &--variant-simple {
        background: transparent;

        // Генерация цветов и hover фона для основных вариантов
        @each $name, $color in $message-variants {
            &--severity-#{$name} {
                color: $color;
                outline-color: $color;
            }
        }
    }

    &--variant-simple {
        --message-padding-y: 0;
        --message-padding-x: 0;
        outline-color: transparent;
    }

    &--severity-secondary {
        color: var(--text-primary);
        background-color: var(--surface-200);
        outline-color: var(--surface-400);
    }

    &--severity-secondary#{&}--variant-outlined,
    &--severity-secondary#{&}--variant-simple {
        background: transparent;
    }

    &--severity-secondary#{&}--variant-simple {
        outline-color: transparent;
    }
}
</style>