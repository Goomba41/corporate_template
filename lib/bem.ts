import { bemConfig } from './bem.app.config'

type ModifierValue = boolean | string | null | undefined
type Modifiers = Record<string, ModifierValue>
type ClassValue = string | number | null | undefined | false | 0 | ClassArray
type ClassArray = ClassValue[]

export interface BemConfig {
    ns?: string
    e?: string
    m?: string
    v?: string
    statePrefix?: string
    hasPrefix?: string
}

const DEFAULT_CONFIG: Required<BemConfig> = {
    ns: '',
    e: '__',
    m: '--',
    v: '-',
    statePrefix: 'is-',
    hasPrefix: 'has-',
}

/**
 * Тип вызываемой BEM-функции с утилитами
 */
export interface BEMFunction {
    (): string
    (element: string, modifiers?: Modifiers): string
    (modifiers: Modifiers): string
    mix(...classes: ClassValue[]): string | undefined
    state(states: Record<string, boolean>, prefix?: string): string
    is(states: Record<string, boolean>): string
    has(states: Record<string, boolean>): string
}

/**
 * Создаёт привязанную к блоку BEM-функцию
 */
export function block(block: string, config: BemConfig = {}): BEMFunction {
    const cfg = { ...DEFAULT_CONFIG, ...config }
    const fullBlock = `${cfg.ns}${block}`

    const build = (el?: string, mods?: Modifiers): string => {
        let cls = fullBlock
        if (el) cls += `${cfg.e}${el}`
        if (mods) {
            const modClasses: string[] = []

            for (const [k, v] of Object.entries(mods)) {
                if (v == null || v === false) continue

                if (typeof v === 'string') {
                    modClasses.push(`${cfg.m}${k}${cfg.v}${v}`)
                } else if (v === true) {
                    modClasses.push(`${cfg.m}${k}`)
                }
            }

            if (modClasses.length) {
                cls += ` ${modClasses.join(' ')}`
            }
        }
        return cls
    }

    // Вызываемая функция с перегрузками
    const fn = ((elOrMods?: string | Modifiers, mods?: Modifiers) => {
        if (typeof elOrMods === 'object' && elOrMods !== null && !Array.isArray(elOrMods)) {
            return build(undefined, elOrMods)
        }
        return build(elOrMods as string | undefined, mods)
    }) as BEMFunction

    // Утилиты
    fn.mix = (...classes: ClassValue[]) => {
        const flatten = (arr: any[]): any[] =>
            arr.reduce((acc, val) =>
                Array.isArray(val) ? [...acc, ...flatten(val)] : [...acc, val], []
            )

        return flatten(classes)
            .filter(c => c != null && c !== '' && c !== false)
            .join(' ')
            .trim() || undefined // возвращаем undefined вместо пустой строки
    }

    fn.state = (states, prefix = cfg.statePrefix) =>
        Object.entries(states).filter(([, v]) => v).map(([k]) => `${prefix}${k}`).join(' ')

    fn.is = (states) => fn.state(states, cfg.statePrefix)
    fn.has = (states) => fn.state(states, cfg.hasPrefix)
    fn.toString = () => fullBlock

    return fn
}

/**
 * appBEM — фабрика с предустановленным namespace проекта
 * appBEM('popover') → возвращает BEMFunction, привязанную к 'hh-popover'
 */
export const appBEM = (blockName: string) => block(blockName, bemConfig)