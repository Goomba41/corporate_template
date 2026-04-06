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
                <div
                    v-if="showArrow"
                    class="popover__arrow"
                    ref="floatingArrow"
                    :style="arrowStyles"
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
import { type CSSProperties } from 'vue';
import { offset, size, flip, shift, arrow, useFloating, autoUpdate, type Placement } from '@floating-ui/vue';

import { onClickOutside, tryOnUnmounted } from '@vueuse/core';

import type { HintedString } from '~/types/hinted-string';

const isClient = import.meta.client;

type PopoverPlacement = Placement | 'auto';

// TODO: сделать валидацию пропсов так, чтобы различать декларативный и императивный режимы управления видимостью
interface Props {
    showArrow?: boolean;
    triggerer?: MaybeRefOrGetter<HTMLElement | null>; // declarative mode
    open?: boolean; // declarative mode
    dismissable?: boolean; // any mode
    // TODO: appendTo
    appendTo?: HTMLElement | HintedString<"body" | "self"> // any mode
    style?: CSSProperties | CSSProperties[];
    class?: string | string[] | Record<string, boolean>;
    placement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
    triggerer: null,
    dismissable: true,
    open: undefined,
    appendTo: 'body',
    placement: 'bottom-start',
    showArrow: false,
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
const floatingArrow = ref<HTMLElement | null>(null);
const resolvedTarget = computed(() => {
    if (!isClient) return null;
    return toValue(props.triggerer) ?? null;
})

const internalOpen = ref(false);

const isVisible = computed({
    get: () => props.open ?? internalOpen.value,
    set: (val) => {
        internalOpen.value = val;
        emit('update:open', val);
    }
});

const ARROW_SIZE = 16;
const ARROW_HALF = ARROW_SIZE / 2;
const BORDER_WIDTH = 1;
const PADDING = 6;

const dynamicPadding = computed(() => 
  props.showArrow ? ARROW_HALF + PADDING : PADDING + BORDER_WIDTH
);

const { floatingStyles, middlewareData, placement, update } = useFloating(resolvedTarget, popoverRef, {
    middleware: [
        arrow({ element: floatingArrow, padding: PADDING + BORDER_WIDTH }),
        offset(dynamicPadding.value),
        flip({
            padding: dynamicPadding.value,
            fallbackPlacements: props.placement === 'auto'
                ? ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end']
                : undefined,
        }),
        shift({ padding: dynamicPadding.value }),
        size({
            apply({ availableWidth, availableHeight, elements }) {
                Object.assign(elements.floating.style, {
                    maxWidth: `${Math.max(0, availableWidth)}px`,
                    maxHeight: `${Math.max(0, availableHeight)}px`,
                });
            },
        }),
    ],
    whileElementsMounted: autoUpdate, // автообновление позиции при изменении размера/прокрутке окна или изменении размеров целевого элемента
    placement: props.placement === 'auto' ? undefined : props.placement,
});

watch(dynamicPadding, () => {
  update();
}, { flush: 'post' });

const arrowStyles = computed(() => {
    const { arrow: arrowData } = middlewareData.value;
    const currentPlacement = placement.value;

    if (!arrowData || (arrowData.x == null && arrowData.y == null)) return {};

    // 1. Определяем основную сторону (без -start/-end)
    const side = (currentPlacement.split('-')[0] || 'bottom') as 'top' | 'bottom' | 'left' | 'right';

    // 2. Карта противоположных сторон
    // Если popover снизу (bottom), стрелка должна быть сверху (top) popover'а
    const staticSideMap = {
        top: 'bottom',    // Popover над триггером → стрелка внизу popover'а
        bottom: 'top',    // Popover под триггером → стрелка вверху popover'а
        left: 'right',    // Popover слева → стрелка справа popover'а
        right: 'left',    // Popover справа → стрелка слева popover'а
    };

    const staticSide = staticSideMap[side];

    // 3. Формируем стили
    return {
        // Позиционирование по осям (middleware сам решит, что использовать)
        left: arrowData.x != null ? `${arrowData.x}px` : '',
        top: arrowData.y != null ? `${arrowData.y}px` : '',
        right: arrowData.x != null ? undefined : 'auto',
        bottom: arrowData.y != null ? undefined : 'auto',

        // 🔑 КРИТИЧНО: Явно крепим стрелку к нужной стороне popover'а
        // и сбрасываем остальные, чтобы CSS не конфликтовал
        [staticSide]: `-${ARROW_SIZE}px`,  // Выступ стрелки за пределы popover
        [side]: 'auto',        // Сброс противоположной стороны

        // Вращение стрелки (чтобы она указывала на триггер)
        transform: getArrowRotation(side),
    };
});

const getArrowRotation = (side: string) => {
    return {
        top: 'rotate(180deg)',   // Стрелка вниз
        bottom: 'rotate(0deg)',  // Стрелка вверх
        left: 'rotate(90deg)',   // Стрелка вправо
        right: 'rotate(-90deg)', // Стрелка влево
    }[side] || 'rotate(0deg)';
};

watch(isVisible, (newVal) => {
    if (newVal) {
        emit('show');
    } else {
        emit('hide');
    }
})

let removeClickListener: (() => void) | undefined;

watchEffect(() => {
  if (!isVisible.value || props.dismissable === false) {
    removeClickListener?.();
    removeClickListener = undefined;
    return;
  }
  
  // Пересоздаем слушатель только если нужно
  removeClickListener?.();
  removeClickListener = onClickOutside(
    popoverRef,
    () => { isVisible.value = false; },
    { ignore: [resolvedTarget] }
  );
});

// tryOnUnmounted безопаснее для SSR — не упадёт, если вызван на сервере
tryOnUnmounted(() => {
    removeClickListener?.();
});

defineExpose({
    element: popoverRef,
    // TODO: передача цели
    // ТОЛЬКО ПРИ ИМПЕРАТИВНОМ ПОДОХОДЕ КОНТРОЛЯ ЗА ВИДИМОСТЬЮ
    toggle: () => {
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

    &__arrow {
        position: absolute;
        width: 16px; // Размер стрелки
        height: 16px;
        pointer-events: none;

        // Оба псевдо-элемента — треугольники через border
        &::before,
        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
        }

        // Больший треугольник (граница)
        &::before {
            top: 0;
            left: 0;
            border-width: 8px; // Половина от width/height
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: var(--border-primary);
            border-left-color: transparent;
        }

        // Меньший треугольник (фон) - накладывается сверху
        &::after {
            border-width: 7px; // На 1px меньше (толщина границы)
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: var(--bg-primary);
            border-left-color: transparent;
            top: 2px;
            left: 1px;
        }
    }

    :where(.mode-dark) & {
        border: 1px solid var(--border-secondary);

        &__arrow {
            color: var(--border-secondary);

            &::before {
                border-top-color: transparent;
                border-right-color: transparent;
                border-bottom-color: var(--border-secondary);
                border-left-color: transparent;
            }

            &::after {
                border-top-color: transparent;
                border-right-color: transparent;
                border-bottom-color: var(--bg-primary);
                border-left-color: transparent;
            }
        }
    }
}
</style>