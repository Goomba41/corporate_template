<!-- 
TODO: Переопределение цветов
-->

<template>
    <div :class="progressClasses">
        <div
            class="progress-bar__value"
            :style="{ 'width': currentProgress }"
        >
            <div
                v-if="props.showValue || $slots.default !== undefined"
                class="progress-bar__label"
            >
                <template v-if="!$slots.default">
                    {{ currentProgress }}
                </template>
                <slot v-else>
                </slot>
            </div>
        </div>
    </div>
</template>

<script
    setup
    lang="ts"
>
interface Props {
    value?: number | null; // TODO: должен быть строго меньше max
    mode?: "indeterminate" | "determinate"; // TODO: сделать состояние
    showValue?: boolean;
    max?: number;
    // variant?: dynamic animation vs static
}

const props = withDefaults(defineProps<Props>(), {
    value: null,
    showValue: true,
    max: 100,
    mode: 'determinate'
})

const progressClasses = computed(() => ([
    'progress-bar',
    `progress-bar--${props.mode}`
]))

const currentProgress = computed(() => `${((props.value ?? 0) / props.max) * 100}%`)
</script>

<style
    lang="scss"
    scoped
>
.progress-bar {
    display: block;
    position: relative;
    overflow: hidden;
    height: 1.25rem;
    background: var(--border-primary);
    border-radius: 0.5rem;

    &__value {
        margin: 0;
        background: var(--primary-500);
    }

    &__label {
        color: var(--text-inverse);
        font-size: 0.75rem;
        font-weight: 600;
    }

    &--determinate & {
        &__value {
            height: 100%;
            width: 0%;
            position: absolute;
            // display: none; не понятно зачем
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: width 1s ease-in-out;
        }

        &__label {
            display: inline-flex;
        }
    }
}
</style>