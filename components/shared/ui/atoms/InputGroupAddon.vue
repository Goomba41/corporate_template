<script
    setup
    lang="ts"
>
const bem = appBEM('input-group-addon')
</script>

<template>
    <div :class="bem.toString()">
        <slot />
    </div>
</template>

<style
    scoped
    lang="scss"
>
// TODO: проверить float-label, checkbox
.hh-input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-color: var(--border-secondary);
    background: var(--bg-primary);
    color: var(--surface-400);
    border-block-start: 1px solid var(--border-secondary);
    border-block-end: 1px solid var(--border-secondary);
    min-width: 2.5rem;
    line-height: normal;

    overflow: hidden;
    isolation: isolate;

    &:has(.hh-button) {
        padding: 0;
    }

    &> :deep(.hh-button) {
        border-radius: 0;
        border: none;
        width: 100%;
    }

    // Граница слева: для первого элемента И для любого аддона после другого элемента
    &:first-child,
    &+& {
        border-inline-start: 1px solid var(--border-secondary);
    }

    &:first-child {
        border-start-start-radius: 0.5rem;
        border-end-start-radius: 0.5rem;
    }

    &:last-child {
        border-start-end-radius: 0.5rem;
        border-end-end-radius: 0.5rem;
        border-inline-end: 1px solid var(--border-secondary);
    }
}

.mode-dark .hh-input-group-addon {
    background: var(--bg-secondary);
}
</style>