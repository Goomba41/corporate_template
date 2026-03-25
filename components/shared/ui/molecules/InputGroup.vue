<script
    setup
    lang="ts"
>
/**
 * @file InputGroup.vue
 * @description Компонент группировки элементов ввода.
 * @namespace UI.Atoms
 * @layer Presentation (Clean Architecture)
 */

// Явное имя компонента для соответствия принципам DDD и реестру компонентов
defineOptions({
    name: 'InputGroup',
});

/**
 * @slot default - Контейнер для дочерних элементов
 */
defineSlots<{
    default(): any;
}>();
</script>

<template>
    <div class="input-group">
        <slot />
    </div>
</template>

<style
    scoped
    lang="scss"
>
.input-group {
    display: inline-flex;
    align-items: stretch;

    :deep(> *) {

        /* Левый элемент (удаляем правые скругления) */
        &:first-child:not(:only-child) {
            border-end-end-radius: 0;
            border-start-end-radius: 0;
        }

        /* Правый элемент (удаляем левые скругления) */
        &:last-child:not(:only-child) {
            border-end-start-radius: 0;
            border-start-start-radius: 0;
        }

        /* Все срединные элементы */
        &:not(:first-child):not(:last-child) {
            border-radius: 0;
        }

        &:not(:last-child) {
            border-inline-end: 0 none;
        }
    }
}
</style>