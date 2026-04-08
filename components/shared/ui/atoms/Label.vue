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

const bem = appBEM('label')
</script>

<template>
    <label
        :for="for"
        :class="bem({
            'error': error,
            'required': required
        })"
    >
        <slot />
        <IconUiAsteriskDuotone
            v-if="required"
            :class="bem('icon')"
        />
    </label>
</template>

<style
    scoped
    lang="scss"
>
.hh-label {
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: color 0.2s ease;
    display: flex;
    align-items: center;

    &--required #{&}__icon {
        color: var(--accent-error);
        margin-left: 0.25rem;
        width: 0.875rem;
        height: 0.875rem;
    }

    &--error {
        color: var(--accent-error);
    }
}
</style>