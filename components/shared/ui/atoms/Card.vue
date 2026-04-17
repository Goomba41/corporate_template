<script
    setup
    lang="ts"
>
/**
 * Универсальная карточка-контейнер (Атом)
 * 
 * Предоставляет стилизованную поверхность с гибкой структурой слотов
 * для агрегации контента. Не содержит бизнес-логики, используется
 * как базовый строительный блок в дизайн-системе.
 * 
 * @example
 * ```vue
 * <Card variant="elevated">
 *   <template #header><AppLogo /></template>
 *   <template #title>Заголовок</template>
 *   <p>Основной контент</p>
 *   <template #footer><ActionButton /></template>
 * </Card>
 * ```
 */

// Явное имя компонента для соответствия принципам DDD и реестру компонентов
defineOptions({
    name: 'Card',
});

/**
 * Слоты компонента
 * @slot header - Опциональная шапка карточки (обычно для заголовка секции или действий)
 * @slot title - Заголовок карточки (автоматически стилизуется)
 * @slot subtitle - Подзаголовок карточки (вторичный текст)
 * @slot content - Основной контент карточки (обязательный слот)
 * @slot footer - Опциональный подвал карточки (обычно для кнопок действий)
 */
defineSlots<{
    header?(): unknown;
    title?(): unknown;
    subtitle?(): unknown;
    content(): unknown;
    footer?(): unknown;
}>();

const bem = appBEM('card')
</script>

<template>
    <div :class="bem.toString()">
        <header
            v-if="$slots.header"
            :class="bem('header')"
        >
            <slot name="header" />
        </header>

        <div :class="bem('body')">
            <div
                v-if="$slots.title || $slots.subtitle"
                :class="bem('caption')"
            >
                <div
                    v-if="$slots.title"
                    :class="bem('title')"
                >
                    <slot name="title" />
                </div>
                <div
                    v-if="$slots.subtitle"
                    :class="bem('subtitle')"
                >
                    <slot name="subtitle" />
                </div>
            </div>
            <div
                v-if="$slots.content"
                :class="bem('content')"
            >
                <slot name="content" />
            </div>
        </div>
        <div
            v-if="$slots.footer"
            :class="bem('footer')"
        >
            <slot name="footer" />
        </div>
    </div>
</template>


<style
    scoped
    lang="scss"
>
$card-gap: calc(var(--spacing) * 2);
$card-padding: calc(var(--spacing) * 5);

.hh-card {
    background: var(--bg-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    border-radius: calc(var(--ui-radius) * 1.5);
    display: flex;
    flex-direction: column;
    line-height: normal;

    &__body {
        padding-inline: $card-padding;
        padding-top: $card-padding;
        display: flex;
        flex-direction: column;
        gap: $card-gap;
    }

    &__caption {
        display: flex;
        flex-direction: column;
        gap: $card-gap;
    }

    &__title {
        font-size: calc(var(--spacing) * 5);
        font-weight: 500;
    }

    &__subtitle {
        color: var(--surface-400)
    }

    &__footer {
        margin-top: $card-gap;
        padding-inline: $card-padding;
        padding-bottom: $card-padding;
    }
}

.hh-card {
    &:not(:has(&__footer)) &__body {
        padding-bottom: $card-padding;
    }
}
</style>