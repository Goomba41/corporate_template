<!-- 
  @component FloatLabel
  @description Поведенческая молекула для реализации паттерна "плавающий лейбл" (floating label).
               Композирует AtomLabel и слот с полем ввода, управляя позиционированием лейбла
               в зависимости от состояний фокуса и заполненности поля.
  
  @slot label - Контент лейбла. Получает контекст: { required?: boolean }
  @slot input - Поле ввода. Получает контекст: { id: string }
  
  @example
  <MoleculeFloatLabel label="Email" :required="true">
    <template #input="{ id }">
      <AtomInputText :id="id" v-model="email" />
    </template>
  </MoleculeFloatLabel>
-->
<!-- NOTE: error для label контролируется через scss :has(.input-invalid) -->
<template>
    <span :class="bem({
        variant: props.variant
    })">
        <AtomLabel
            :class="bem('label-slot')"
            :required="required"
            :for="inputId"
        >
            <slot name="label" />
        </AtomLabel>
        <slot
            name="input"
            :id="inputId"
        />
    </span>
</template>

<script
    setup
    lang="ts"
>
type Props = {
    id?: string;
    required?: boolean;
    variant?: 'over' | 'in' | 'on'
};

const props = withDefaults(defineProps<Props>(), {
    variant: 'on'
})

const bem = appBEM('float-label')

const generatedId = useId()
const inputId = computed(() => props.id || generatedId)
</script>

<style
    scoped
    lang="scss"
>
.hh-float-label {
    display: block;
    position: relative;

    &:has(.hh-input-text--invalid):has([data-focused="false"]) &__label-slot {
        color: var(--accent-error);
    }

    &__label-slot {
        position: absolute;
        pointer-events: none;
        top: 50%;
        transform: translateY(-50%);
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        inset-inline-start: 0.75rem;
        z-index: 1;
        color: var(--text-secondary);
        transition-duration: 0.2s;
        font-size: inherit;
        font-weight: inherit;
    }

    &:not(:has(.hh-input-text--invalid)) &__label-slot {
        opacity: 0.7;
    }

    &:has([data-focused=true], [data-filled=true]) &__label-slot {
        color: inherit;
        opacity: 1;
        font-weight: 400;
        font-size: 0.75rem;
    }

    // NOTE: в дальнейшем может понадобиться обработка случаев:
    // &:has(input:focus) label,
    // &:has(input:-webkit-autofill) label,
    // &:has(textarea:focus) label,
    // &:has(input[placeholder]) label,
    // &:has(textarea[placeholder]) label

    &--variant-over:has([data-focused=true], [data-filled=true]) &__label-slot {
        top: -1rem;
        transform: translateY(0);
    }

    &--variant-on:has([data-focused=true], [data-filled=true]) &__label-slot {
        top: 0;
        transform: translateY(-50%);
        border-radius: calc(var(--spacing) * 2);
        background: var(--bg-primary);
        padding-inline: calc(var(--spacing) / 2);
    }

    &--variant-in:has([data-focused=true], [data-filled=true]) &__label-slot {
        top: 0.875rem;
    }

    // NOTE: в дальнейшем с floatlabel будут сочетаться эти элементы:
    // & .hh-textarea,
    // & .hh-select-label,
    // & .hh-multiselect-label,
    // & .hh-multiselect-label:has(.p-chip),
    // & .hh-autocomplete-input-multiple,
    // & .hh-cascadeselect-label,
    // & .hh-treeselect-label
    &--variant-in :deep([data-role="input"]) {
        padding-block-start: 1.5rem;
        padding-block-end: 0.5rem;

    }
}
</style>