<template>
    <Transition name="fade">
        <Teleport
            v-if="isVisible"
            :to="teleportTarget"
            :disabled="teleportTarget === null"
        >
            <div
                ref="popoverRef"
                tabindex="0"
                :class="[bem(), props.class]"
                :style="[floatingStyles, style]"
            >
                <div
                    v-if="showArrow"
                    :class="bem('arrow')"
                    ref="floatingArrow"
                    :style="arrowStyles"
                >
                </div>
                <div :class="bem('content')">
                    <slot />
                </div>
            </div>
        </Teleport>
    </Transition>
</template>

<script
    setup
    lang="ts"
>
/**
 * Atom: Popover
 * 
 * Универсальный компонент всплывающего окна с позиционированием.
 * Поддерживает два режима управления видимостью:
 * - Декларативный: через `v-model:open` + `:triggerer`
 * - Императивный: через методы `toggle()`, `show()`, `hide()`
 * 
 * @features
 * - Позиционирование через @floating-ui (flip, shift, arrow)
 * - Teleport в body / self / custom element
 * - Закрытие по клику вне (dismissable)
 * - Анимация появления/исчезновения через Transition
 * - SSR-совместимость (Nuxt)
 * 
 * @example Declarative mode
 * ```vue
 * <AtomPopover 
 *   v-model:open="isOpen" 
 *   :triggerer="buttonRef"
 * >
 *   <div>Content</div>
 * </AtomPopover>
 * ```
 * 
 * @example Imperative mode
 * ```vue
 * <AtomPopover ref="popoverRef">
 *   <div>Content</div>
 * </AtomPopover>
 * 
 * <button @click="popoverRef?.toggle(buttonEl)">Toggle</button>
 * ```
 * 
 * @slot default - Контент попапа
 * @event update:open - Эмит при изменении видимости (для v-model)
 * @event show - Эмит при открытии
 * @event hide - Эмит при закрытии
 */

// ============================================================================
// 1️⃣ 📦 MODULE SETUP: Imports, Types, Constants
// ============================================================================
// #region Module Setup
import { type CSSProperties } from 'vue';
import { offset, size, flip, shift, arrow, useFloating, autoUpdate, type Placement } from '@floating-ui/vue';

import { onClickOutside, tryOnUnmounted } from '@vueuse/core';

import type { HintedString } from '~/types/hinted-string';

import { appBEM } from '~/lib/bem';

const isClient = import.meta.client;

// Arrow metrics (вынесены в константы для переиспользования)
const ARROW_SIZE = 16;
const ARROW_HALF = ARROW_SIZE / 2;
const BORDER_WIDTH = 1;
const PADDING = 6;

// BEM генератор для классов
const bem = appBEM('popover')

// Type definitions
type PopoverPlacement = Placement | 'auto';

type PopoverBaseProps = {
    showArrow?: boolean;
    dismissable?: boolean;
    appendTo?: HTMLElement | HintedString<'body' | 'self'>;
    style?: CSSProperties | CSSProperties[];
    class?: string | string[] | Record<string, boolean>;
    placement?: PopoverPlacement;
};

// Декларативный режим: ТРЕБУЕТ open + triggerer
type PopoverDeclarativeProps = {
    open: boolean; // обязательный
    triggerer: MaybeRefOrGetter<HTMLElement | null>; // обязательный
};

// Императивный режим: ЗАПРЕЩАЕТ open + triggerer
type PopoverImperativeProps = {
    open?: never; // запрещён
    triggerer?: never; // запрещён
};

export type Props = PopoverBaseProps &
    (PopoverDeclarativeProps | PopoverImperativeProps);

export interface PopoverExposed {
    element: Ref<HTMLElement | null>;
    toggle: (triggerElement?: MaybeRefOrGetter<HTMLElement | null>) => void;
    show: (triggerElement?: MaybeRefOrGetter<HTMLElement | null>) => void;
    hide: () => void;
}
// #endregion

// ============================================================================
// 2️⃣ 🎛️ COMPONENT INTERFACE: Props, Emits, Options
// ============================================================================
// #region Component Interface
/**
 * @prop {boolean} [showArrow=false] - Показать стрелку-указатель на триггер
 * @prop {boolean} [dismissable=true] - Закрывать ли по клику вне попапа
 * @prop {HTMLElement | 'body' | 'self'} [appendTo='body'] - Куда телепортировать контент
 * @prop {CSSProperties | CSSProperties[]} [style] - Дополнительные инлайн-стили
 * @prop {string | string[] | Record<string, boolean>} [class] - Дополнительные классы
 * @prop {Placement | 'auto'} [placement='bottom-start'] - Предпочтительная позиция относительно триггера
 * 
 * @prop {boolean} open - (Declarative) Контроль видимости извне. Если передан — режим декларативный.
 * @prop {MaybeRefOrGetter<HTMLElement | null>} triggerer - (Declarative) Элемент-якорь для позиционирования. Обязателен в декларативном режиме.
 */
const props = withDefaults(defineProps<Props>(), {
    dismissable: true,
    appendTo: 'body',
    placement: 'bottom-start',
    showArrow: false,
    open: undefined,
    triggerer: undefined,
})

defineOptions({
    inheritAttrs: false
});

const emit = defineEmits<{
    'update:open': [value: boolean];
    'show': [];
    'hide': [];
}>();
// #endregion

// ============================================================================
// 3️⃣ 💾 INTERNAL STATE: Refs, Computed, Reactive Logic
// ============================================================================
// #region Internal State
// DOM & State Refs 
const popoverRef = ref<HTMLElement | null>(null);
const floatingArrow = ref<HTMLElement | null>(null);
const lastTriggerRef = ref<HTMLElement | null>(null);
const internalOpen = ref(false);

/**
 * Определяет режим управления: декларативный (через пропсы) или императивный (через методы)
 */
const isDeclarativeMode = computed(() => props.open !== undefined);

// Место размещения попапа (для Teleport)
/**
 * Вычисляет, куда телепортировать контент попапа.
 * Поддерживает: 'body' | 'self' | HTMLElement | CSS-селектор
 */
const teleportTarget = computed(() => {
    if (!isClient) return null;

    const target = props.appendTo;

    // Если строка — пробуем найти по селектору
    if (typeof target === 'string') {
        // 1. Если self — не телепортировать (рендерить на месте)
        if (target === 'self') return null

        return document.body;
    }

    // 3. Если HTMLElement — проверяем, что он в DOM
    if (target instanceof HTMLElement) {
        if (!document.contains(target)) {
            console.warn('[Popover]: appendTo element not in DOM, falling back to body');
            return document.body;
        }
        return target;
    }

    return document.body;
});

// Динамический отступ для middleware (учитывает наличие стрелки)
const dynamicPadding = computed(() =>
    props.showArrow ? ARROW_HALF + PADDING : PADDING + BORDER_WIDTH
);

/**
 * Вычисляет целевой элемент для позиционирования:
 * - В декларативном режиме: берёт из пропса `triggerer`
 * - В императивном режиме: берёт из `lastTriggerRef` (переданного в методы)
 */
const resolvedTarget = computed(() => {
    if (!isClient) return null;

    if (isDeclarativeMode.value) {
        return toValue(props.triggerer) ?? null;
    } else {
        return lastTriggerRef.value;
    }
})

// Логика видимости: контролируется через v-model:open или внутренне
/**
 * Реактивное состояние видимости с поддержкой v-model:open.
 * Если передан проп `open` — контролируется извне, иначе — внутреннее состояние.
 */
const isVisible = computed({
    get: () => props.open ?? internalOpen.value,
    set: (val) => {
        internalOpen.value = val;
        emit('update:open', val);
    }
});
// #endregion

// ============================================================================
// 4️⃣ 🧭 CORE FEATURE: Floating UI Positioning
// ============================================================================
// #region Floating UI: Positioning & Arrow
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

// Пересчитываем позицию при изменении отступов (например, при toggle showArrow)
watch(dynamicPadding, () => {
    update();
}, { flush: 'post' })

/**
 * Возвращает угол поворота стрелки в зависимости от стороны размещения
 */
const getArrowRotation = (side: string) => {
    return {
        top: 'rotate(180deg)',   // Стрелка вниз
        bottom: 'rotate(0deg)',  // Стрелка вверх
        left: 'rotate(90deg)',   // Стрелка вправо
        right: 'rotate(-90deg)', // Стрелка влево
    }[side] || 'rotate(0deg)';
};

/**
 * Вычисляет стили для стрелки-указателя на триггер.
 * Учитывает текущую позицию попапа и направление стрелки.
 */
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
// #endregion

// ============================================================================
// 5️⃣ 👁️ VISIBILITY & INTERACTIONS: Events, Dismiss, User Behavior
// ============================================================================
// #region Visibility & Interactions
watch(isVisible, (newVal) => {
    if (newVal) {
        emit('show');
    } else {
        emit('hide');
    }
})

let removeClickListener: (() => void) | undefined;

/**
 * Управляет подпиской на клик вне попапа.
 * Слушатель активируется только когда попап видим и dismissable=true.
 */
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

// Очистка слушателя при анмаунте (безопасно для SSR)
tryOnUnmounted(() => {
    removeClickListener?.();
});
// #endregion

// ============================================================================
// 6️⃣ 🔧 PUBLIC API + LIFECYCLE: Expose, Validation, Hooks
// ============================================================================
// #region Public API & Lifecycle
/**
 * @exposed
 * @property {Ref<HTMLElement | null>} element - Ссылка на корневой DOM-элемент попапа (после телепортации)
 * @method {function} toggle - Переключить видимость. Опционально принимает новый trigger-элемент (для императивного режима)
 * @method {function} show - Принудительно открыть. Опционально принимает trigger-элемент
 * @method {function} hide - Принудительно закрыть
 */
defineExpose({
    element: popoverRef,

    /**
     * Переключает видимость попапа.
     * @param triggerElement - Опциональный элемент-триггер (для императивного режима)
     */
    toggle: (triggerElement?: MaybeRefOrGetter<HTMLElement | null>) => {
        if (!isClient) {
            console.warn('[Popover]: toggle method called on server-side, ignoring.');
            return;
        }

        if (triggerElement) lastTriggerRef.value = toValue(triggerElement);

        // В декларативном режиме предупреждаем, если пытаются управлять через методы
        if (isDeclarativeMode.value) {
            console.warn(
                '[Popover]: toggle() called in declarative mode. ' +
                'Control visibility via v-model:open instead.'
            );
        }

        if (!resolvedTarget.value && !isVisible.value) {
            console.error('[Popover]: no trigger element provided');
            return;
        }

        isVisible.value = !isVisible.value;
    },

    /**
     * Принудительно открывает попап.
     * @param triggerElement - Опциональный элемент-триггер
     */
    show: (triggerElement?: MaybeRefOrGetter<HTMLElement | null>) => {
        if (triggerElement) lastTriggerRef.value = toValue(triggerElement);

        if (isDeclarativeMode.value) {
            console.warn('[Popover]: show() called in declarative mode. Use v-model:open instead.');
        }

        if (resolvedTarget.value) isVisible.value = true;
    },

    /**
     * Принудительно закрывает попап.
     */
    hide: () => {
        if (isDeclarativeMode.value) {
            console.warn('[Popover]: hide() called in declarative mode. Use v-model:open instead.');
        }
        isVisible.value = false;
    }
})

const validateProps = () => {
    if (!isClient) return;

    const hasOpen = props.open !== undefined;
    const hasTriggerer = props.triggerer != null;

    // === ДЕКЛАРАТИВНЫЙ РЕЖИМ ===
    if (hasOpen && !hasTriggerer) {
        console.error(
            `[Popover] Declarative mode error:
      • "open" prop is provided (v-model:open), but "triggerer" is missing.
      • Fix: Add :triggerer="elementRef" for positioning.
      • Or: Remove "open" prop to use imperative mode with ref.toggle().`
        );
        return false;
    }

    // === ИМПЕРАТИВНЫЙ РЕЖИМ ===
    if (!hasOpen && hasTriggerer) {
        console.warn(
            `[Popover] Imperative mode notice:
      • "triggerer" prop is ignored in imperative mode.
      • Fix: Pass element to methods: ref.toggle(elementRef)
      • Or: Add "open" prop to switch to declarative mode.`
        );
    }

    // === ОБЩИЕ ПРОВЕРКИ ===
    if (hasOpen && hasTriggerer) {
        // Это валидный декларативный режим — всё ок
        return true;
    }

    if (!hasOpen && !hasTriggerer) {
        // Это валидный императивный режим — всё ок
        return true;
    }

    return true;
};

onMounted(async () => {
    // 1. Ждем следующего тика, чтобы завершился текущий цикл обновления DOM
    await nextTick();

    // 2. Небольшая задержка (0-16ms), чтобы гарантировать, что 
    // родительские компоненты успели прокинуть свои рефы вниз
    // Это решает проблему "ложных" ошибок при гидратации/маунте
    await new Promise(resolve => setTimeout(resolve, 0));

    // 3. Только теперь запускаем валидацию, когда все рефы должны быть на месте
    validateProps();

    // 4. Дополнительная проверка значения (опционально, для отладки)
    if (isDeclarativeMode.value && props.triggerer !== null && props.triggerer !== undefined) {
        if (toValue(props.triggerer) == null) {
            console.warn('[Popover] Triggerer prop is set, but element is null. Check if the target element is mounted.');
        }
    }
});

// Перепроверка при смене режима (open prop)
watch(() => props.open, () => {
    validateProps();
}, { flush: 'post' });
// #endregion
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

.hh-popover {
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