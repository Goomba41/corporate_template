<script
    setup
    lang="ts"
>
interface Props {
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{}>()

const bem = appBEM('button-group')
</script>

<template>
    <div :class="bem.toString()">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.hh-button-group {
    display: inline-flex;

    :deep(.hh-button) {
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