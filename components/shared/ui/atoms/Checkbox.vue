<template>
    <div :class="inputClasses">
        <input
            ref="inputRef"
            type="checkbox"
            :class="bem('input')"
            :disabled="disabled"
            :id="inputId"
            @change="handleToggle"
            @keydown.enter.space.prevent="handleToggle"
        >
        <div :class="bem('box')">
            <span
                v-if="state !== 'unchecked'"
                :class="bem('icon')"
            >
                <slot :name="state === 'indeterminate' ? 'indeterminateIcon' : 'checkedIcon'">
                    <IconUiMinus v-if="state === 'indeterminate'" />
                    <IconUiCheck v-else />
                </slot>
            </span>
        </div>
    </div>
</template>

<script
    setup
    lang="ts"
>
type CheckboxState = 'checked' | 'unchecked' | 'indeterminate'

interface Props {
    value?: any,
    trueValue?: any,
    falseValue?: any,
    indeterminate?: boolean,

    inputId?: string,
    variant?: 'filled',
    size?: 'sm' | 'md' | 'lg',
    disabled?: boolean,
    invalid?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
})

const bem = appBEM('checkbox')

const inputClasses = computed(() => bem({
    size: props.size,
    variant: props.variant,
    disabled: props.disabled,
    invalid: props.invalid,
    checked: state.value === 'checked',
    indeterminate: state.value === 'indeterminate',
}))

const inputRef = ref<HTMLInputElement | null>(null)

const model = defineModel<any | any[] | null>({ default: false })

const state = computed<CheckboxState>(() => {
    // 1. Режим массива
    if (Array.isArray(model.value)) {
        return model.value.includes(props.value) ? 'checked' : 'unchecked'
    }

    // 2. Логический тристейт: null = indeterminate
    if (model.value === null) return 'indeterminate'

    // 3. Бинарный режим
    const tv = props.trueValue ?? true
    return model.value === tv ? 'checked' : 'unchecked'
})

const handleToggle = (event: Event) => {
    if (props.disabled) {
        event.preventDefault()
        return
    }

    const current = model.value

    if (Array.isArray(current)) {
        const exists = current.includes(props.value)
        model.value = exists ? current.filter(v => v !== props.value) : [...current, props.value]
        return
    }

    // Цикл: false → true → null → false
    const tv = props.trueValue ?? true
    const fv = props.falseValue ?? false

    if (current === tv) model.value = fv
    else if (current === fv && props.indeterminate) model.value = null
    else model.value = tv
}

const effectiveState = computed<CheckboxState>(() => {
    if (props.indeterminate === true) return 'indeterminate'
    return state.value
})

watch(effectiveState, (newState) => {
    if (!inputRef.value) return
    inputRef.value.checked = newState === 'checked'
    inputRef.value.indeterminate = newState === 'indeterminate'
}, { immediate: true })
</script>

<style
    scoped
    lang="scss"
>
.hh-checkbox {
    --checkbox-width: calc(var(--spacing) * 5);
    --checkbox-height: var(--checkbox-width);
    --checkbox-radius: calc(var(--ui-radius) * 1);
    --checkbox-checked-background: var(--primary-600);
    --checkbox-checked-hover: var(--primary-700);
    --checkbox-checked-border-color: var(--checkbox-checked-background);
    --checkbox-transition-duration: 0.2s;
    --checkbox-icon-size: calc(var(--checkbox-width) - (var(--spacing) * 1.5));

    position: relative;
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;

    &,
    &__box {
        width: var(--checkbox-width);
        height: var(--checkbox-height);
    }

    &--size-sm {
        --checkbox-width: calc(var(--spacing) * 4);
    }

    &--size-lg {
        --checkbox-width: calc(var(--spacing) * 6);
    }

    &__input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: var(--checkbox-radius);
    }

    &__box {
        display: flex;
        // justify-content: center;
        align-items: center;
        border-radius: var(--checkbox-radius);
        transition: background-color var(--checkbox-transition-duration), color var(--checkbox-transition-duration), border-color var(--checkbox-transition-duration), box-shadow var(--checkbox-transition-duration), outline-color var(--checkbox-transition-duration);
        outline-color: transparent;
        background-color: var(--bg-primary);
        border: 1px solid var(--border-primary);
        box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05);
        cursor: pointer;
    }

    &--checked &__box {
        border-color: var(--checkbox-checked-border-color);
        background: var(--checkbox-checked-background);
    }

    &__icon {
        transition-duration: var(--checkbox-transition-duration);
        color: var(--text-inverse);
        transform: translateX(10%);
        font-size: var(--checkbox-icon-size);
        width: var(--checkbox-icon-size);
        height: var(--checkbox-icon-size);

        :deep(svg) {
            font-size: var(--checkbox-icon-size);
            width: var(--checkbox-icon-size);
            height: var(--checkbox-icon-size);
        }
    }

    &--indeterminate &__icon {
        color: var(--text-primary);
    }


    &--disabled &__box {
        background-color: var(--border-primary);
        border-color: var(--border-secondary);
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    &--invalid &__box {
        border-color: var(--accent-error);
    }

    &--variant-filled:not(&--checked) &__box {
        background-color: var(--surface-100);
    }

    &--variant-filled#{&}--checked &__box {
        background-color: color-mix(in srgb, var(--checkbox-checked-background) 70%, var(--text-primary) 30%);
    }

    &:not(&--checked):not(&--disabled):hover &__box {
        border-color: var(--text-tertiary);
    }

    &--checked:not(&--disabled):hover &__box {
        background-color: var(--checkbox-checked-hover);
        border-color: var(--checkbox-checked-hover);
    }

    :where(.mode-dark) & {
        &__box {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-secondary);
        }
    }

    :where(.mode-dark) &--variant-filled:not(&--checked) &__box {
        background-color: var(--bg-primary);
    }

    :where(.mode-dark) &--checked:hover &__box {
        --checkbox-checked-hover: var(--primary-500);
    }
}
</style>