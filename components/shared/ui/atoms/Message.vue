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
    size: 'md',
    life: undefined,
    appearance: 'bottom-top'
})

const emit = defineEmits(['lifeEnd', 'close'])

const messageClasses = computed(() => ({
    'message': true,
    'message-primary': props.severity === 'primary',
    'message-secondary': props.severity === 'secondary',
    'message-success': props.severity === 'success',
    'message-danger': ['danger', 'error'].includes(props.severity),
    'message-info': props.severity === 'info',
    'message-warning': props.severity === 'warning',
    'message-help': props.severity === 'help',

    'message-sm': props.size === 'sm',
    'message-md': props.size === 'md',
    'message-lg': props.size === 'lg',

    'message-outlined': props.variant === 'outlined',
    'message-simple': props.variant === 'simple',
}))

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
    <Transition :name="`message-slide-fade-${appearance}`" mode="out-in">
        <PrimeMessage
            v-if="visible"
            v-model:visible="visible"
            :class="messageClasses"
        >
            <template #default>
                <slot />
            </template>

            <template
                v-if="$slots.icon"
                #icon
            >
                <div :class="['icon']">
                    <slot name="icon"></slot>
                </div>
            </template>
        </PrimeMessage>
    </Transition>
</template>

<style
    scoped
    lang="scss"
>
@use 'sass:list';

// TODO: БЭМ
// Карта основных вариантов и их цветов
$message-variants: (
    success: var(--accent-success),
    warning: var(--accent-warning),
    danger: var(--accent-error),
    info: var(--accent-info),
    help: var(--accent-help),
    primary: var(--primary-600),
);

$message-appearance-variants: (
    'top-bottom':    (translateY(-10px), translateY(10px)),
    'bottom-top':    (translateY(10px), translateY(-10px)),
    'left-right':    (translateX(-10px), translateX(10px)),
    'right-left':    (translateX(10px), translateX(-10px)),
    'top':           (translateY(-5px), translateY(5px)),
    'bottom':        (translateY(5px), translateY(-5px)),
    'left':          (translateX(-5px), translateX(5px)),
    'right':         (translateX(5px), translateX(-5px)),
);

@each $name, $transforms in $message-appearance-variants {
    $enter-transform: list.nth($transforms, 1);
    $leave-transform: list.nth($transforms, 2);
    
    .message-slide-fade-#{$name} {
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

.message {
    color: var(--text-inverse);
    border-radius: 0.5rem;
    font-weight: 500;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    outline-width: 1px;
    outline-style: solid;
    line-height: normal;

    :deep(div[data-pc-section="contentwrapper"]) {
        max-width: 100%;
        min-height: 0;

        div[data-pc-section="content"] {
            display: flex;
            align-items: center;
            gap: calc(var(--spacing) * 2);
        }
    }

    .icon {
        svg {
            width: 100%;
            height: 100%;
            /* опционально, убирает лишние отступы */
            display: block;
        }
    }

    &.message-sm {
        :deep(div[data-pc-section="content"]) {
            padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5);

            div[data-pc-section="text"] {
                font-size: 0.875rem;
            }
        }
    }

    &.message-md {
        :deep(div[data-pc-section="content"]) {
            padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);

            div[data-pc-section="text"] {
                font-size: 1rem;
            }
        }
    }

    &.message-lg {
        :deep(div[data-pc-section="content"]) {
            padding: calc(var(--spacing) * 2.5) calc(var(--spacing) * 3.5);

            div[data-pc-section="text"] {
                font-size: 1.125rem;
            }
        }
    }

    &.message-secondary {
        background-color: var(--surface-200);
        outline-color: var(--surface-400);
    }

    @each $name, $color in $message-variants {
        &.message-#{$name} {
            color: $color;
            background-color: color-mix(in srgb, $color, transparent 90%);
            outline-color: color-mix(in srgb, $color, transparent 75%);
        }
    }

    &.message-outlined,
    &.message-simple {
        background: transparent;

        // Генерация цветов и hover фона для основных вариантов
        @each $name, $color in $message-variants {
            &.message-#{$name} {
                color: $color;
                outline-color: $color;
            }
        }

        &.message-simple {
            outline-color: transparent;
        }

        // Secondary variant (использует другие переменные для hover)
        &.message-secondary {
            color: var(--surface-500);
            background-color: transparent;
        }
    }

    &.message-simple {
        :deep(div[data-pc-section="content"]) {
            padding: 0;
        }
    }

    &.message-secondary {
        color: var(--text-primary);
    }
}

.mode-dark {
    .message-secondary {
        background-color: var(--surface-800);
        outline-color: var(--surface-600);

        &.message-simple {
            outline-color: transparent
        }
    }
}
</style>