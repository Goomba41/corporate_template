<script
    setup
    lang="ts"
>
interface Props {
    for?: string
    required?: boolean
    error?: boolean
}

defineProps<Props>()
</script>

<template>
    <label
        :for="for"
        class="label"
        :class="[
            { 'label--error': error, 'label--required': required }
        ]"
    >
        <slot />
        <IconUiAsteriskDuotone
            v-if="required"
            class="label__required"
        />
    </label>
</template>

<style
    scoped
    lang="scss"
>
.label {
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: color 0.2s ease;
    display: flex;
    align-items: center;

    &--required {
        .label__required {
            color: var(--accent-error);
            margin-left: 0.25rem;
            width: 0.875rem;
            height: 0.875rem;
        }
    }

    &--error {
        color: var(--accent-error);
    }
}
</style>