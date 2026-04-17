<script
    setup
    lang="ts"
>
import type { HintedString } from '~/types/hinted-string';

// Явное имя компонента для соответствия принципам DDD и реестру компонентов
defineOptions({
    name: 'Skeleton',
});

interface Props {
    shape?: HintedString<'circle' | 'rectangle'>
    size?: string,
    width?: string,
    height?: string,
    borderRadius?: string,
    animation?: HintedString<'none' | 'wave' | 'pulse'>,
}

const props = withDefaults(defineProps<Props>(), {
    shape: 'rectangle',
    width: '100%',
    height: '1rem',
    animation: 'wave',
})

const inlineStyles = computed(() => ({
    width: props.size || props.width,
    height: props.size || props.height,
    borderRadius: props.borderRadius || (props.shape === 'circle' ? '50%' : undefined),
}));

const bem = appBEM('skeleton')
</script>

<template>
    <div
        :class="bem({ animation: props.animation })"
        :style="inlineStyles"
    ></div>
</template>

<style
    scoped
    lang="scss"
>
$skeleton-base: var(--surface-200);
$skeleton-highlight: rgba(255, 255, 255, 0.6);
$skeleton-base-dark: rgba(255, 255, 255, 0.1);
$skeleton-highlight-dark: rgba(255, 255, 255, 0.1);

.hh-skeleton {
    display: block;
    overflow: hidden;
    background-color: var(--skeleton-base, $skeleton-base);
    border-radius: calc(var(--ui-radius) * 1.5);
    overflow: hidden;
    position: relative;

    /* --- АНИМАЦИИ --- */

    /* 1. WAVE */
    &--animation-wave {
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 300%;
            height: 100%;
            background: linear-gradient(135deg,
                    transparent 0%,
                    transparent 20%,
                    $skeleton-highlight 45%,
                    $skeleton-highlight 55%,
                    transparent 80%,
                    transparent 100%);
            transform: translateX(-100%);
            animation: skeleton-wave 2s infinite ease-in-out;
            will-change: transform;
        }
    }

    /* 2. PULSE (Мягкое мерцание) */
    &--animation-pulse {
        background-image: none;
        animation: skeleton-pulse 3s infinite ease-in-out;
    }

    @keyframes skeleton-wave {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(66.66%);
        }
    }

    @keyframes skeleton-pulse {

        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0.3;
        }
    }
}

@at-root {
    .mode-dark {
        .hh-skeleton {
            --skeleton-base: #{$skeleton-base-dark};

            &--animation-wave::before {
                background: linear-gradient(135deg,
                    transparent 0%,
                    transparent 20%,
                    #{$skeleton-highlight-dark} 45%,
                    #{$skeleton-highlight-dark} 55%,
                    transparent 80%,
                    transparent 100%);
            }
        }
    }
}
</style>