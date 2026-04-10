<template>
    <CenteredContaner :class="bem('container')">
        <!-- TODO: вынести форму логина в отдельный компонент -->
        <AtomCard :class="bem('form')">
            <template #content>
                <div :class="bem('form-container')">
                    <img
                        :class="bem('logotype')"
                        src="../public/favicon.svg"
                        alt=""
                        :width="64"
                        :height="64"
                    >
                    <h1 :class="bem('header')">Log in</h1>
                    <h4
                        :class="bem('subheader')"
                        @click="toggleDisplayMode"
                    >Please enter your details</h4>

                    <div :class="bem('form-fields')">
                        <AtomInputText
                            fluid
                            :placeholder="'username / email / phone number'"
                        />
                        <MoleculePassword
                            fluid
                            :placeholder="'password'"
                        />
                        <div :class="bem('options')">
                            <!-- TODO: атом чекбокса -->
                            <div class="">Remember me</div>
                            <AtomButton
                                variant="link"
                                :label="'Forgot password?'"
                            />
                        </div>
                        <AtomButton
                            class="w-full"
                            :label="'Log in'"
                        />
                        <div :class="bem('register')">Not registered?
                            <AtomButton
                                variant="link"
                                :label="'Create an account'"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </AtomCard>
    </CenteredContaner>
    <img
        src="../assets/images/login-background.svg"
        alt=""
        :class="bem('background')"
    >
    <!-- TODO: виджет (организм) настройка темы, языка, режима и пр. боковой слайдер-->
</template>

<script
    setup
    lang="ts"
>
definePageMeta({
    layout: 'login'
})

const bem = appBEM('authorization')

const {
    colorSurface,
    colorTheme,
    displayMode,
    toggleDisplayMode,
    cycleColorTheme,
    cycleColorSurface
} = useTheme()

useHead({
    bodyAttrs: {
        style: () => `background-color: var(--primary-${displayMode.value === 'dark' ? 900 : 700});`
    }
})
</script>

<style
    scoped
    lang="scss"
>
.hh-authorization {

    :where(.mode-dark) & {
        &__container {
            background: color-mix(in srgb, black 30%, transparent 70%);
        }
    }

    &__container {
        position: absolute;
    }

    &__background {
        max-height: 100dvh;
        width: 100%;
    }

    &__form-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-block: 2rem;
    }

    &__subheader {
        max-width: 55%;
        text-align: center;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    &__logotype {
        border-radius: 36%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        background-color: var(--surface-800);
    }

    &__form-fields {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 4);
        width: 75%;
    }

    &__options {
        justify-content: space-between;
    }
    
    &__register {
        justify-content: center;
        margin-top: 2rem;
    }

    &__options,
    &__register {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: calc(var(--spacing) * 2);
    }

    &__subheader,
    &__register {
        color: var(--text-tertiary);
    }
}
</style>