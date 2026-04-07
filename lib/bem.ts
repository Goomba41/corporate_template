import { bemConfig } from './bem.app.config'

// lib/bem.ts
type ModifierValue = boolean | string | number | null | undefined
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
  mix(...classes: ClassValue[]): string
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
      for (const [k, v] of Object.entries(mods)) {
        if (v) cls += `${cfg.m}${k}${typeof v === 'string' ? `${cfg.v}${v}` : ''}`
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
  fn.mix = (...classes: ClassValue[]) =>
    classes.flat(1).filter(Boolean).join(' ').trim()

  fn.state = (states, prefix = cfg.statePrefix) =>
    Object.entries(states).filter(([, v]) => v).map(([k]) => `${prefix}${k}`).join(' ')

  fn.is = (states) => fn.state(states, cfg.statePrefix)
  fn.has = (states) =>
    Object.entries(states).filter(([, v]) => v).map(([k]) => `${cfg.hasPrefix}${k}`).join(' ')

  return fn
}

/**
 * cn — фабрика с предустановленным namespace проекта
 * cn('popover') → возвращает BEMFunction, привязанную к 'hh-popover'
 */
export const cn = (blockName: string) => block(blockName, bemConfig)