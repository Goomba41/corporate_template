<!--
/**
 * @file ThemeConfigurator.vue
 * @description Компонент интерфейса для настройки визуальной темы приложения.
 * 
 * @module components/shared/ui/organisms/ThemeConfigurator
 * @category UI Layer / Presentational Component
 * 
 * @remarks
 * - Реализует паттерн Atomic Design: использует только атомы (AtomButton, AtomPopover)
 * - Применяет BEM через appBEM helper для изоляции стилей
 * - Полностью типизирован с TypeScript, поддерживает i18n
 * - Не содержит бизнес-логики: делегирует всё композируемым функциям
 * 
 * @performance
 * - v-for с :key по стабильному идентификатору
 * - scoped styles предотвращают утечки
 * - Инлайновые стили для предпросмотра цвета минимальны и безопасны
 */
-->
<template>
    <div :class="[bem.toString()]">
        <AtomButton
            ref="popoverTarget"
            severity="primary"
            :size="size"
            @click="popoverIsVisible = !popoverIsVisible"
        >
            <template #icon>
                <IconUiSwatches />
            </template>
        </AtomButton>
        <AtomPopover
            v-model:open="popoverIsVisible"
            :triggerer="popoverTarget"
            append-to="body"
        >
            <div class="flex flex-col gap-6">
                <!-- Палитры -->
                <div>
                    <h4 class="mb-2">{{ $t(`${i18nPath}.brands.label`) }}</h4>
                    <div class="grid grid-cols-3 gap-2">
                        <AtomButton
                            v-for="item in getColorThemes()"
                            :key="item.label"
                            :label="$t(`${i18nPath}.brands.items.${item.label}`)"
                            :severity="colorTheme === item.key ? 'primary' : 'secondary'"
                            class="justify-start!"
                            variant="outlined"
                            size="sm"
                            @click="setColorTheme(item.key)"
                        >
                            <template #icon>
                                <IconUiCircleFill :style="`color: ${item.preview}`" />
                            </template>
                        </AtomButton>
                    </div>
                </div>

                <!-- Фоны -->
                <div>
                    <h4 class="mb-2">{{ $t(`${i18nPath}.surfaces.label`) }}</h4>
                    <div class="grid grid-cols-3 gap-2">
                        <AtomButton
                            v-for="item in getColorSurfaces()"
                            :key="item.label"
                            :label="$t(`${i18nPath}.surfaces.items.${item.label}`)"
                            :severity="colorSurface === item.key ? 'primary' : 'secondary'"
                            class="justify-start!"
                            variant="outlined"
                            size="sm"
                            @click="setColorSurface(item.key)"
                        >
                            <template #icon>
                                <IconUiCircleFill :style="`color: ${item.preview}`" />
                            </template>
                        </AtomButton>
                    </div>
                </div>

                <!-- Языки -->
                <div>
                    <h4 class="mb-2">{{ $t(`${i18nPath}.locales`) }}</h4>
                    <div class="grid grid-cols-3 gap-2">
                        <AtomButton
                            v-for="item in allLocales"
                            :key="item.code"
                            :label="item.name"
                            :severity="appLocale === item.code ? 'primary' : 'secondary'"
                            class="justify-start!"
                            variant="outlined"
                            size="sm"
                            @click="setAppLocale(item.code)"
                        >
                            <template #icon>
                                <component :is="localeIcons[item.code]"></component>
                            </template>
                        </AtomButton>
                    </div>
                </div>

                <!-- Режимы -->
                <div>
                    <h4 class="mb-2">{{ $t(`${i18nPath}.modes.label`) }}</h4>
                    <div class="grid grid-cols-3 gap-2">
                        <AtomButton
                            v-for="item in getDisplayModes()"
                            :key="item"
                            :label="$t(`${i18nPath}.modes.items.${item}`)"
                            :severity="displayMode === item ? 'primary' : 'secondary'"
                            class="justify-start!"
                            variant="outlined"
                            size="sm"
                            @click="setDisplayMode(item)"
                        >
                            <template #icon>
                                <component :is="modeIcons[item]"></component>
                            </template>
                        </AtomButton>
                    </div>
                </div>
                
                <!-- Скругления -->
                <div>
                    <h4 class="mb-2">{{ $t(`${i18nPath}.roundings.label`) }}</h4>

                    <div class="grid grid-cols-3 gap-2">
                        <AtomButton
                            v-for="item in getUICorners()"
                            :key="item"
                            :label="$t(`${i18nPath}.roundings.items.${transformI18NumberKey(item)}`)"
                            :severity="uiCorner === item ? 'primary' : 'secondary'"
                            class="justify-start!"
                            variant="outlined"
                            size="sm"
                            @click="setUICorner(item)"
                        />
                    </div>
                </div>
            </div>
        </AtomPopover>
    </div>
</template>

<script
    setup
    lang="ts"
>
import { IconUiLocalesEN, IconUiLocalesLA, IconUiLocalesRU, IconUiMonitor, IconUiMoon, IconUiSun } from '#components';

interface Props {
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'lg',
})

// 🔑 Путь к ключам i18n для этого компонента
const i18nPath = 'theme-configurator'

// 🎨 BEM helper: генерирует классы вида 'theme-configurator theme-configurator--lg'
const bem = appBEM('theme-configurator')

// 🎛️ Делегируем всю логику композиции тем
const {
    colorTheme,
    colorSurface,
    displayMode,
    uiCorner,
    getUICorners,
    setUICorner,
    getColorThemes,
    setColorTheme,
    getColorSurfaces,
    setColorSurface,
    getDisplayModes,
    setDisplayMode,
} = useTheme()

// 🌐 Интеграция с системой локализации
const { appLocale, allLocales, setAppLocale } = useLocale()

/**
 * 🗂️ Маппинг режимов отображения к иконкам.
 * @note Используется в шаблоне через <component :is>
 */
const modeIcons = {
    "dark": IconUiMoon,
    "light": IconUiSun,
    "system": IconUiMonitor,
}

/**
 * 🗂️ Маппинг кодов языков к иконкам.
 * @note Типизирован по ключам allLocales для безопасности
 */
const localeIcons = {
    "la": IconUiLocalesLA,
    "en": IconUiLocalesEN,
    "ru": IconUiLocalesRU,
}

/**
 * 🔧 Утилита для преобразования числовых ключей в формат i18n.
 * 
 * @param n - Числовое значение скругления (0, 0.25, 0.5)
 * @returns Строка для подстановки в ключ перевода
 * @example 0.25 → '0-25' → i18n ключ 'roundings.items.0-25'
 * 
 * @warning Это временное решение. В идеале использовать enum или string keys
 * для параметров, чтобы избежать таких трансформаций.
 */
const transformI18NumberKey = (n: number) => n.toString().replace('.', '-')

const popoverTarget = ref<HTMLElement | null>(null)

const popoverIsVisible = ref(false)
</script>

<style
    scoped
    lang="scss"
></style>