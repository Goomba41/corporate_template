<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="isVisible"
                ref="popoverRef"
                tabindex="0"
                :class="['popover', props.class]"
                :style="[floatingStyles, style]"
            >
                <!-- TODO: стрелку, возможно prop для показа стрелки -->
                <div
                    ref="floatingArrow"
                    :style="{
                        width: 10,
                        height: 10,
                        background: 'aqua',
                        position: 'absolute',
                        left:
                            middlewareData.arrow?.x != null
                                ? `${middlewareData.arrow.x}px`
                                : '',
                        top:
                            middlewareData.arrow?.y != null
                                ? `${middlewareData.arrow.y}px`
                                : '',
                    }"
                >
                </div>
                <div class="popover__content">
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script
    setup
    lang="ts"
>
import { ref } from 'vue';
import { size, flip, shift, arrow, useFloating, autoUpdate } from '@floating-ui/vue';

import { onClickOutside } from '@vueuse/core';

import type { HintedString } from '~/types/hinted-string';

const isClient = import.meta.client;

// TODO: сделать валидацию пропсов так, чтобы различать декларативный и императивный режимы управления видимостью
interface Props {
    triggerer: MaybeRefOrGetter; // declarative mode
    open?: boolean; // declarative mode
    dismissable?: boolean; // any mode
    appendTo?: HTMLElement | HintedString<"body" | "self"> // any mode
    style?: Record<string, any>;
    class?: string | string[] | Record<string, boolean>;
}

const props = withDefaults(defineProps<Props>(), {
    triggerer: null,
    dismissable: true,
    open: undefined,
    appendTo: 'body',
})

defineOptions({
    inheritAttrs: false
});

const emit = defineEmits<{
    'update:open': [value: boolean];
    'show': [];
    'hide': [];
}>();

const popoverRef = ref<HTMLElement | null>(null);
const floatingArrow = ref(null);
const resolvedTarget = computed(() => {
    if (!isClient) return null;
    return unref(props.triggerer) ?? null;
})

const internalOpen = ref(false);

const isVisible = computed({
    get: () => props.open ?? internalOpen.value,
    set: (val) => {
        internalOpen.value = val;
        emit('update:open', val);
    }
});

const { floatingStyles, middlewareData } = useFloating(resolvedTarget, popoverRef, {
    middleware: [
        arrow({ element: floatingArrow }),
        flip(),    // Переворот, если не влезает
        shift(),
        size({
            apply({ availableWidth, availableHeight, elements }) {
                Object.assign(elements.floating.style, {
                    maxWidth: `${Math.max(0, availableWidth)}px`,
                    maxHeight: `${Math.max(0, availableHeight)}px`,
                });
            },
        }),
    ],   // Сдвиг, если вылезает за экран],
    whileElementsMounted: autoUpdate, // автообновление позиции при изменении размера/прокрутке окна или изменении размеров целевого элемента
    placement: 'bottom-start',
});

watch(isVisible, async (newVal) => {
    if (newVal) {
        emit('show');
    } else {
        emit('hide');
    }
})

onClickOutside(popoverRef, () => {
    // Сработает и для императивного, и для декларативного режимов
    if (props.dismissable !== false && isVisible.value) isVisible.value = false;
}, { ignore: [resolvedTarget] });

defineExpose({
    element: popoverRef,
    // TODO: возможно, стоит сюда передавать и targetRef для более гибкого управления
    // ТОЛЬКО ПРИ ИМПЕРАТИВНОМ ПОДОХОДЕ КОНТРОЛЯ ЗА ВИДИМОСТЬЮ
    toggle: () => {
        console.log('toggle popover');
        isVisible.value = !isVisible.value;
    },
    show: () => { isVisible.value = true; },
    hide: () => { isVisible.value = false; }
})
</script>

<style
    lang="scss"
    scoped
>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.popover {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    will-change: transform;
    z-index: 1001;

    &__content {
        padding: calc(var(--spacing) * 3);
    }

    :where(.mode-dark) & {
        border: 1px solid var(--border-secondary);
    }
}
</style>