export const bemConfig = {
  ns: import.meta.env.VITE_APP_NAMESPACE || 'hh-',
  e: '__',
  m: '--',
  v: '-',
  statePrefix: 'is-',
  hasPrefix: 'has-',
} as const