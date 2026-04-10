<!-- components/shared/layout/CenteredContainer.vue -->
<template>
    <div :class="containerClasses">
        <div :class="bem('content')">
            <slot />
        </div>
    </div>
</template>

<script
    setup
    lang="ts"
>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    vertical?: boolean
    horizontal?: boolean
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    bg?: string
}>(), {
    vertical: true,
    horizontal: true,
    maxWidth: 'md',
    padding: 'lg',
    bg: 'transparent'
})

const bem = appBEM('container')

const containerClasses = computed(() => bem({
    pad: props.padding,
    'max-w': props.maxWidth,
    vertical: props.vertical,
    horizontal: props.horizontal
}))
</script>

<style
    scoped
    lang="scss"
>
.hh-container {
    display: flex;
    width: 100%;
    min-height: 100dvh;
    align-items: flex-start;
    justify-content: flex-start;
    background: transparent;

    &__content {
        width: 100%;
    }

    /* Отступы */
    &--pad-none &__content {
        padding: 0;
    }

    &--pad-sm &__content {
        padding: 0.75rem;
    }

    &--pad-md &__content {
        padding: 1.5rem;
    }

    &--pad-lg {
        padding: 2rem;
    }

    &--pad-xl &__content {
        padding: 3rem;
    }

    /* Адаптив: на мобильных уменьшаем отступы */
    @media (max-width: 640px) {

        &--pad-lg &__content,
        &--pad-xl &__content {
            padding: 1rem;
        }
    }

    /* Максимальная ширина */
    &--max-w-sm &__content {
        max-width: 320px;
    }

    &--max-w-md &__content {
        max-width: 480px;
    }

    &--max-w-lg &__content {
        max-width: 640px;
    }

    &--max-w-xl &__content {
        max-width: 768px;
    }

    &--max-w-2xl &__content {
        max-width: 1024px;
    }

    &--max-w-full &__content {
        max-width: 100%;
    }

    &--vertical {
        align-items: center;
    }
    
    &--horizontal {
        justify-content: center;
    }
}
</style>