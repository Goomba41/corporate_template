<template>
    <div :class="progressClasses">
        <div
            class="progress-bar__value"
            :style="{ 'width': mode === 'determinate' ? currentProgress : undefined }"
        >
            <div
                v-if="mode === 'determinate' && (props.showValue || $slots.default !== undefined)"
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
const props = defineProps({
    value: {
        type: [Number, null],
        default: null,
        validator(value: number, props: { max: number }) {

            if (!Number.isFinite(value)) {
                console.warn('[ProgressBar] value должно быть числом')
                return false
            }

            if (value > props.max) {
                console.warn(`[ProgressBar] значение (${value}) больше максимального (${props.max})\nЗначение будет автоматически пересчитано.`)
                return false
            }

            return true
        },
        required: true
    },
    max: {
        type: [Number],
        default: 100,
        validator(value: number) {
            if (!Number.isFinite(value) || value <= 0) {
                console.warn('[ProgressBar] max должен быть положительным числом')
                return false
            }
            return true
        }
    },
    showValue: {
        type: Boolean,
        default: true,
    },
    mode: {
        type: String as () => "indeterminate" | "determinate",
        default: "determinate",
        validator(value: string) {
            return ["indeterminate", "determinate"].includes(value)
        }
    }
})


const progressClasses = computed(() => ([
    'progress-bar',
    `progress-bar--${props.mode}`
]))

const currentProgress = computed(() => `${((normalizedValue.value) / props.max) * 100}%`)

const normalizedValue = computed(() => Math.min(props.max, props.value ?? 0))
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
        margin-inline: 0.5rem;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &--determinate & {
        &__value {
            height: 100%;
            width: 0%;
            position: absolute;
            // display: none; не понятно зачем
            display: flex;
            align-items: center;
            justify-content: end;
            overflow: hidden;
            transition: width 1s ease-in-out;
            min-width: fit-content;
        }

        &__label {
            display: inline-flex;
        }
    }

    &--indeterminate & {
        &__value {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 40%;
            animation: progress-slide 2.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
    }

    @keyframes progress-slide {
        0% {
            transform: translateX(-100%);
        }

        50% {
            transform: translateX(250%);
        }

        50.1% {
            /* Мгновенный «перескок» для бесшовного цикла */
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(250%);
        }
    }
}
</style>