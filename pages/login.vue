<template>
    <!-- Контейнер формы входа -->
    <CenteredContainer :class="bem('container')">
        <AtomCard :class="bem('form')">
            <template #content>
                <!-- Форма входа -->
                <WidgetFormLogin />
            </template>
        </AtomCard>
    </CenteredContainer>

    <!-- Задник -->
    <img
        :src="loginBackground"
        alt=""
        :class="bem('background')"
    >

    <!-- Настройщик темы -->
    <OrganismThemeConfigurator :class="bem('theme-configurator')" />
</template>

<script
    setup
    lang="ts"
>
import loginBackground from '~/assets/images/login-background.svg?url'

definePageMeta({
    layout: 'login'
})

const { displayMode } = useTheme()

useHead({
    bodyAttrs: {
        style: () => `background-color: var(--primary-${displayMode.value === 'dark' ? 900 : 700}); overflow: hidden;`
    }
})

const bem = appBEM('login')

</script>

<style
    scoped
    lang="scss"
>
.hh-login {
    &__background {
        max-width: unset;
        justify-self: center;
        width: fit-content;
        height: 100%;
    }

    &__container {
        position: absolute;
    }

    &__theme-configurator {
        position: absolute;
        bottom: calc(var(--spacing) * 8);
        right: calc(var(--spacing) * 8);
    }
}
</style>