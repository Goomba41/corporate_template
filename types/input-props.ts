import type { HintedString } from "./hinted-string"

export interface InputProps {
    size?: 'sm' | 'md' | 'lg'
    placeholder?: string,
    invalid?: boolean
    fluid?: boolean,
    variant?: 'filled'
    disabled?: boolean
    loading?: boolean,
    type?: HintedString<'text' | 'password'>
}


