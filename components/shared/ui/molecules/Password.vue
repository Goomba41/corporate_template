<script
    setup
    lang="ts"
>
import type { InputProps } from '~/types/input-props';

interface Props {
    toggleMask?: boolean,
    feedback?: boolean,
    validationState
    // weakLabel
    // mediumLabel
    // strongLabel
    // showClear
}

const props = withDefaults(defineProps<Props & Omit<InputProps, 'type'>>(), {
    size: 'md',
})

const emit = defineEmits<{ 'input-change': [value: string] }>()

const handleChange = (value: string) => {
    emit('input-change', value)
}

const model = defineModel<string>()

defineSlots<{
    header?(): unknown;
    content(): unknown;
    footer?(): unknown;
}>();

const passwordClasses = computed(() => ([
    'input-password',
]))

const isVisible = ref<boolean>(false)

const inputType = computed(() => props.toggleMask && isVisible.value ? 'text' : 'password')
</script>

<template>
    <div class="input-password__wrapper">
        <div
            class="input-password"
            :class="passwordClasses"
        >
            <AtomInputText
                v-model="model"
                :disabled="disabled || loading"
                :placeholder="placeholder"
                :loading="loading"
                :size="size"
                :invalid="invalid"
                :fluid="fluid"
                :variant="variant"
                :type="inputType"
                @input-change="handleChange"
            />
            <!-- TODO: слоты maskIcon, unmaskIcon -->
            <!-- TODO: popover со слотами header, content, footer -->
        </div>
    </div>
</template>

<style
    scoped
    lang="scss"
>
// .input-password {}</style>
