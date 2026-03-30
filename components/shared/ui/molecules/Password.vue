<script
    setup
    lang="ts"
>
import type { InputProps } from '~/types/input-props';
import type { DisplayablePasswordValidationResult } from '~/types/presentation/password';

interface Props {
    toggleMask?: boolean,
    feedback?: boolean,
    validationState?: DisplayablePasswordValidationResult
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
    content?(): unknown;
    footer?(): unknown;
}>();

const passwordClasses = computed(() => ([
    'input-password',
]))

const isVisible = ref<boolean>(false)

const inputType = computed(() => props.toggleMask && isVisible.value ? 'text' : 'password')

// TODO: перед loading запоминать состояние фокусировки и возвращать его обратно после завершения loading
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

            <!-- TODO: добавить к условиям проверку состояния фокусировки (vueUse?) -->
            <div v-if="model !== undefined && model.length && validationState !== undefined">
                <!-- TODO: popover атом (или молекула, но скорее атом) -->
                {{ validationState.feedback }}
                <template v-if="validationState.errors.length">
                    <h5 class="mt-4 mb-4 text-red">Ошибки:</h5>
                    <div
                        v-for="error in validationState.errors"
                        :key="error.code"
                    >
                        {{ error.message }}
                    </div>
                </template>
                <template v-if="validationState.warnings.length">
                    <h5 class="mt-4 mb-4 text-warning">Предупреждения:</h5>
                    <div
                        v-for="warning in validationState.warnings"
                        :key="warning.code"
                    >
                        {{ warning.message }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style
    scoped
    lang="scss"
>
// .input-password {}</style>
