import { bemConfig } from './bem.app.config'

/**
 * Допустимые значения для модификатора БЭМ:
 * - `true` → добавит класс `block--modifier` (булевый модификатор)
 * - `string | number` → добавит класс `block--modifier-value` (ключ-значение)
 * - `false`/`null`/`undefined` → модификатор игнорируется
 */
type ModifierValue = boolean | string | number | null | undefined

/**
 * Словарь модификаторов: { [name]: value }
 * @example
 * { active: true, theme: 'dark', disabled: false }
 * → ['--active', '--theme-dark']
 */
type Modifiers = Record<string, ModifierValue>

/**
 * Допустимые значения для классов в утилите `mix`:
 * Поддерживает вложенные массивы, числа, пустые значения (фильтруются)
 */
type ClassValue = string | number | null | undefined | false | ClassArray
type ClassArray = ClassValue[]

/**
 * Список опций в утилите `mix`:
 */
interface MixOptions {
    /**
     * Выполнить дедупликацию массива классов
     */
    dedupe?: boolean
    // NOTE: на будущее
    // separator?: string
}

/**
 * Конфигурация генератора БЭМ-классов
 */
export interface BemConfig {
    /** 
     * Namespace проекта (префикс для всех блоков)
     * @example 'hh-' → блок 'card' станет 'hh-card'
     * @default ''
     */
    ns?: string
    /** 
     * Разделитель блока и элемента
     * @default '__' → 'block__element'
     */
    e?: string
    /** 
     * Префикс модификатора
     * @default '--' → 'block--modifier'
     */
    m?: string
    /** 
     * Разделитель имени модификатора и его значения
     * @default '-' → 'block--theme-dark'
     */
    v?: string
    /** 
     * Префикс для state-модификаторов (утилита `is`/`state`)
     * @default 'is-' → 'is-active'
     */
    statePrefix?: string
    /** 
     * Префикс для has-модификаторов (утилита `has`)
     * @default 'has-' → 'has-icon'
     */
    hasPrefix?: string
}

/**
 * Конфигурация по умолчанию (используется, если не передана своя)
 */
const DEFAULT_CONFIG: Required<BemConfig> = {
    ns: '',
    e: '__',
    m: '--',
    v: '-',
    statePrefix: 'is-',
    hasPrefix: 'has-',
}

/**
 * Тип основной BEM-функции с утилитами.
 * 
 * Функция полиморфна: в зависимости от аргументов работает в разных режимах.
 * 
 * @note toString() возвращает только базовое имя блока (с namespace),
 *       без учёта элементов и модификаторов.
 * 
 * @example
 * const b = block('card')
 * 
 * // 1. Базовый класс блока
 * b() // → 'card'
 * 
 * // 2. Класс элемента
 * b('title') // → 'card__title'
 * 
 * // 3. Модификаторы блока
 * b({ active: true, theme: 'dark' }) 
 * // → 'card card--active card--theme-dark'
 * 
 * // 4. Модификаторы элемента
 * b('btn', { disabled: true }) 
 * // → 'card__btn card__btn--disabled'
 * 
 * // 5. Утилита mix для сторонних классов
 * b.mix('mt-4', ['d-flex'], false) // → 'mt-4 d-flex'
 * 
 * // 6. State-утилиты
 * b.is({ active: true, hidden: false }) // → 'is-active'
 * b.has({ icon: true }) // → 'has-icon'
 */
export interface BEMFunction {
    /** Возвращает базовый класс блока (с учётом namespace) */
    (): string
    /**
     * Возвращает класс элемента с опциональными модификаторами
     * @param element - имя элемента (без префикса)
     * @param modifiers - объект модификаторов
     */
    (element: string, modifiers?: Modifiers): string
    /**
     * Возвращает класс блока с модификаторами
     * @param modifiers - объект модификаторов
     */
    (modifiers: Modifiers): string
    /**
     * Утилита для объединения сторонних классов (утилиты, миксины)
     * - Рекурсивно сплющивает вложенные массивы
     * - Фильтрует ложные значения: `null`, `undefined`, `false`, `''`, `0`
     * - Возвращает `undefined` если результат пустой (удобно для :class в Vue)
     *
     * @param classes - массивов классов
     * @param options - опции
     * @returns строка классов или `undefined`, если список пуст
     *          Возврат undefined преднамерен: в Vue :class="undefined" 
     *          не добавляет пустой атрибут, в отличие от :class="''".
     * 
     * @example
     * b.mix(['p-2', 'd-flex', 'd-flex'], { dedupe: true })
     * // → 'p-2 d-flex'
     */
    mix(classes: ClassValue[], options?: MixOptions): string | undefined
    /**
     * Генерирует строку state-классов из объекта состояний
     * @param states - объект { [name]: boolean }
     * @param prefix - префикс классов (по умолчанию из конфига)
     * @returns строка классов вида 'prefix-key1 prefix-key2'
     * 
     * @example
     * state({ active: true, hidden: false }, 'is-') // → 'is-active'
     */
    state(states: Record<string, boolean>, prefix?: string): string | undefined
    /**
     * Генерирует is-классы (состояния) с префиксом из конфига
     * @param states - объект { [name]: boolean }
     * @returns строка классов вида 'is-key1 is-key2'
     * 
     * @example
     * is({ loading: true, error: false }) // → 'is-loading'
     */
    is(states: Record<string, boolean>): string | undefined
    /**
     * Генерирует has-классы (признаки наличия) с префиксом из конфига
     * @param states - объект { [name]: boolean }
     * @returns строка классов вида 'has-key1 has-key2'
     * 
     * @example
     * has({ icon: true, badge: false }) // → 'has-icon'
     */
    has(states: Record<string, boolean>): string | undefined
}

/**
 * Создаёт привязанную к блоку BEM-функцию с кастомной конфигурацией.
 * 
 * @param block - имя базового блока (без namespace)
 * @param config - опциональная конфигурация (переопределяет дефолтную)
 * @returns BEMFunction — вызываемая функция с утилитами
 * 
 * @example
 * // Базовое использование
 * const b = block('card')
 * b() // → 'card'
 * 
 * // С кастомным конфигом
 * const b = block('btn', { m: '_', v: '_' })
 * b({ theme: 'primary' }) // → 'btn btn_theme_primary'
 * 
 * // С namespace из проекта
 * const b = block('modal', { ns: 'app-' })
 * b() // → 'app-modal'
 */
export function block(block: string, config: BemConfig = {}): BEMFunction {
    // Объединяем конфиг: переданные параметры имеют приоритет над дефолтными
    // Required<...> нужен, чтобы дальше не проверять каждый ключ на undefined
    const cfg = Object.assign(
        {},
        DEFAULT_CONFIG,
        Object.fromEntries(
            Object.entries(config).filter(([_, v]) => v !== undefined)
        )
    ) as Required<BemConfig>

    // Формируем полное имя блока с учётом namespace проекта
    // Например: ns='hh-', block='card' → fullBlock='hh-card'
    const fullBlock = `${cfg.ns}${block}`

    const sanitizeClassName = (str: string): string =>
        String(str).replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    /**
     * Внутренняя функция сборки класса.
     * Отвечает за конкатенацию: [namespace] + [block] + [element] + [модификаторы]
     * 
     * Ключевой момент: модификаторы формируются ОТ ПОЛНОГО ИМЕНИ (cls),
     * чтобы получить валидный БЭМ-класс: 'block__el--mod', а не '--mod'.
     */
    const build = (el?: string, mods?: Modifiers): string => {
        // Начинаем с базового имени блока (уже с namespace)
        let cls = fullBlock

        // Добавляем элемент, если указан
        // Например: el='title' → cls='hh-card__title'
        if (el) cls += `${cfg.e}${el}`

        const baseClass = sanitizeClassName(cls)

        // Обрабатываем модификаторы, если переданы
        if (mods) {
            const modClasses: string[] = []

            for (const [k, v] of Object.entries(mods)) {
                // Пропускаем "пустые" значения: null, undefined, false
                // Это позволяет условно добавлять модификаторы без ternary-операторов
                if (v == null || v === false || v === '') continue

                const safeKey = sanitizeClassName(k)

                // Формируем класс модификатора
                if (typeof v === 'string' || typeof v === 'number') {
                    const safeValue = sanitizeClassName(String(v))
                    // Ключ-значение: '--theme-dark'
                    // ❗ Важно: используем cls (блок/элемент) как префикс,
                    // чтобы получить валидный БЭМ: 'block__el--key-value'
                    modClasses.push(`${cls}${cfg.m}${safeKey}${cfg.v}${safeValue}`)
                } else if (v === true) {
                    // Булевый модификатор: '--active'
                    modClasses.push(`${cls}${cfg.m}${safeKey}`)
                }
            }

            // Добавляем все сформированные модификаторы к базовому классу через пробел
            // Результат: 'hh-card__item hh-card__item--active hh-card__item--theme-dark'
            if (modClasses.length) {
                cls = [baseClass, ...modClasses].join(' ')
            }
        } else {
            cls = baseClass
        }

        return cls
    }

    const isPlainObject = (obj: unknown): obj is Record<string, unknown> => {
        if (typeof obj !== 'object' || obj === null) return false
        if (Array.isArray(obj) || obj instanceof Date || obj instanceof RegExp) return false
        const proto = Object.getPrototypeOf(obj)
        return proto === Object.prototype || proto === null
    }

    /**
     * Полиморфная функция-обёртка.
     * Определяет режим работы по типу первого аргумента:
     * - объект → считаем, что это модификаторы блока
     * - строка → считаем, что это имя элемента
     * 
     * Приведение `as BEMFunction` нужно, чтобы TypeScript корректно
     * отображал перегрузки в подсказках IDE.
     */
    const fn = ((elOrMods?: string | Modifiers, mods?: Modifiers) => {
        // Явная проверка: если первый аргумент — строка, это элемент
        if (typeof elOrMods === 'string') {
            return build(elOrMods, mods)
        }
        // Если объект — модификаторы блока
        if (isPlainObject(elOrMods)) {
            return build(undefined, elOrMods)
        }
        // Если ничего не передано — базовый класс
        return build()
    }) as BEMFunction

    /**
     * Утилита mix: безопасное объединение сторонних классов.
     * 
     * Особенности:
     * 1. Рекурсивно сплющивает массивы любой вложенности
     * 2. Фильтрует "ложные" значения (null, undefined, false, '', 0)
     * 3. Возвращает undefined вместо пустой строки — это важно для Vue,
     *    потому что :class="undefined" не добавляет лишний пробел в атрибут
     */
    fn.mix = (classes: ClassValue[], options?: MixOptions) => {
        const flatten = (arr: any[]): any[] => {
            const result: any[] = []
            for (const item of arr) {
                if (Array.isArray(item)) {
                    result.push(...flatten(item))
                } else if (item != null && item !== '' && item !== false) {
                    result.push(sanitizeClassName(String(item)))
                }
            }
            return result
        }

        const result = flatten(classes)
        return options?.dedupe
            ? [...new Set(result)].join(' ').trim() || undefined
            : result.join(' ').trim() || undefined
    }

    /**
     * Базовая утилита для генерации префиксных классов (state/has).
     * 
     * @param states - объект состояний { [key]: boolean }
     * @param prefix - префикс для классов (по умолчанию из конфига)
     * @returns строка классов, где ключи с значением true превращены в 'prefix+key'
     */
    fn.state = (states: Record<string, boolean>, prefix = cfg.statePrefix) => {
        const result = Object.entries(states).filter(([, v]) => v).map(([k]) => `${prefix}${sanitizeClassName(k)}`).join(' ')
        return result || undefined
    }

    /**
     * Утилита is(): генерирует классы состояний с префиксом statePrefix.
     * @example is({ active: true }) → 'is-active'
     */
    fn.is = (states: Record<string, boolean>) => fn.state(states, cfg.statePrefix)
    /**
     * Утилита has(): генерирует классы признаков с префиксом hasPrefix.
     * @example has({ icon: true }) → 'has-icon'
     */
    fn.has = (states: Record<string, boolean>) => fn.state(states, cfg.hasPrefix)
    /**
     * Переопределяем toString, чтобы функция вела себя как строка
     * при конкатенации или интерполяции.
     * 
     * @note Возвращаемая функция имеет переопределённый toString(),
     * поэтому может использоваться в шаблонных строках: `${b}` → 'block-name'
     * При сериализации в JSON также будет строка с именем блока. 
     * 
     * @example
     * const b = block('card')
     * `${b}` → 'card'
     * console.log(b) → 'card'
     */
    fn.toString = () => fullBlock

    return fn
}

/**
 * Фабрика BEM-функций с предустановленным namespace проекта.
 * 
 * Использует глобальный `bemConfig` из `bem.app.config`,
 * поэтому все классы автоматически получают префикс проекта.
 * 
 * @param blockName - имя блока (без namespace)
 * @returns BEMFunction, привязанная к блоку с префиксом проекта
 * 
 * @example
 * // При bemConfig = { ns: 'hh-' }
 * const b = appBEM('popover')
 * b()              // → 'hh-popover'
 * b('item')        // → 'hh-popover__item'
 * b({ active: true }) // → 'hh-popover hh-popover--active'
 */
export const appBEM = (blockName: string) => block(blockName, bemConfig)