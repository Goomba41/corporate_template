<script
    setup
    lang="ts"
>

interface Props {
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{}>()
</script>

<template>
    <div class="button-group">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.button-group {
    display: inline-flex;

    :deep(.button) {
        margin: 0;

        /* Крайняя правая кнопка */
        &:first-of-type:not(:only-of-type) {
            border-start-end-radius: 0;
            border-end-end-radius: 0;
        }

        /* Все средние кнопки */
        &:not(:first-of-type):not(:last-of-type) {
            border-radius: 0;
        }

        /* Крайняя левая кнопка */
        &:last-of-type:not(:only-of-type) {
            border-start-start-radius: 0;
            border-end-start-radius: 0;
        }

        &:not(:last-child),
        &:not(:last-child):hover {
            border-inline-end: 0 none;
        }
    }
}
</style>