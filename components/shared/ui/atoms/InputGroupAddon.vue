<script
    setup
    lang="ts"
>
</script>

<template>
    <div
        class="input-group-addon"
    >
        <slot />
    </div>
</template>

<style
    scoped
    lang="scss"
>
// TODO: проверить float-label, checkbox
.input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background: var(--surface-0);
    color: var(--surface-400);
    border-block-start: 1px solid;
    border-block-end: 1px solid;
    border-color: var(--surface-300);
    min-width: 2.5rem;
    line-height: normal;

    overflow: hidden;
    isolation: isolate; 

    &:has(.button) {
        padding: 0;
    }

    & > :deep(.button) {
        border-radius: 0;
        border: none;
        width: 100%;
    }

    // Граница слева: для первого элемента И для любого аддона после другого элемента
    &:first-child, & + & {
        border-inline-start: 1px solid var(--surface-300);
    }

    &:first-child {
        border-start-start-radius: 0.5rem;
        border-end-start-radius: 0.5rem;
    }
    
    &:last-child {
        border-start-end-radius: 0.5rem;
        border-end-end-radius: 0.5rem;
        border-inline-end: 1px solid var(--surface-300);
    }
}

.mode-dark {
    .input-group-addon {
        border-color: var(--surface-500);
        background: var(--surface-950);
    }
}
</style>