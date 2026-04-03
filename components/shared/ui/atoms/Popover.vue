<!-- 
Props:
    dismissable: boolean: true Enables to hide the overlay when outside is clicked.
    appendTo: HTMLElement | HintedString<"body" | "self">: body: A valid query selector or an HTMLElement to specify where the overlay gets attached.
Emits:
    show
    hide
-->

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="isOpen"
                ref="popoverRef"
                tabindex="0"
                class="popover"
                :style="floatingStyles"
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
import { arrow, useFloating } from '@floating-ui/vue';

const isClient = import.meta.client;

const props = defineProps<{
    targetRef: MaybeRefOrGetter<HTMLElement | null>;
    isOpen: boolean;
}>();

const resolvedTarget = computed(() => {
    if (!isClient) return null;
    if (typeof props.targetRef === 'function') {
        return props.targetRef();
    }
    if (props.targetRef && 'value' in props.targetRef) {
        return props.targetRef.value;
    }
    return props.targetRef;
})

const popoverRef = ref<HTMLElement | null>(null);
const floatingArrow = ref(null);

const { floatingStyles, middlewareData } = useFloating(resolvedTarget, popoverRef, {
    middleware: [arrow({ element: floatingArrow })],
});

defineExpose({
    element: popoverRef
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
    margin-block-start: 0.5rem;
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