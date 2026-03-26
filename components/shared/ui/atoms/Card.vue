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
</script>

<template>
    <div class="card">
        <header
            v-if="$slots.header"
            class="card__header"
        >
            <slot name="header" />
        </header>

        <div class="card__body">
            <div
                v-if="$slots.title || $slots.subtitle"
                class="card__caption"
            >
                <div
                    v-if="$slots.title"
                    class="card__title"
                >
                    <slot name="title" />
                </div>
                <div
                    v-if="$slots.subtitle"
                    class="card__subtitle"
                >
                    <slot name="subtitle" />
                </div>
            </div>
            <div
                v-if="$slots.content"
                class="card__content"
            >
                <slot name="content" />
            </div>
        </div>
        <div
            v-if="$slots.footer"
            class="card__footer"
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

.card {
    background: var(--bg-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    border-radius: 0.875rem;
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

.card:not(:has(.card__footer)) .card__body {
    padding-bottom: $card-padding;
}
</style>