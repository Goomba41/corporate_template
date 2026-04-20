<template>
    <div :class="bem('form-container')">
        <img
            :class="bem('logotype')"
            src="../../public/favicon.svg"
            alt=""
            :width="64"
            :height="64"
        >
        <h1 :class="bem('header')">{{ $t(`${i18nPath}.header`) }}</h1>
        <h4 :class="bem('subheader')">{{ $t(`${i18nPath}.subheader`) }}</h4>

        <!-- TODO: скелетоны изначально, после ввода данных блокировка и loading state -->
        <div :class="bem('form-fields')">
            <AtomInputText
                v-model="form.login"
                fluid
                :placeholder="$t(`${i18nPath}.username`)"
            />
            <MoleculePassword
                v-model="form.password"
                fluid
                :placeholder="$t(`${i18nPath}.password`)"
            />
            <div :class="bem('options')">
                <div class="flex gap-2">
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2">

                            <AtomCheckbox
                                input-id='remember'
                                v-model="form.remember"
                            />
                            <AtomLabel
                                size="md"
                                for="remember"
                                class=""
                            >{{ $t(`${i18nPath}.remember.text`) }}</AtomLabel>
                        </div>
                        <div :class="bem('remember-hint')">
                            {{ $t(`${i18nPath}.remember.hint`) }}
                        </div>
                    </div>
                </div>
                <AtomButton
                    variant="link"
                    :label="$t(`${i18nPath}.restore`)"
                />
            </div>
            <AtomButton
                class="w-full"
                :label="$t(`${i18nPath}.button`)"
            />
            <div :class="bem('register')">{{ $t(`${i18nPath}.question`) }}
                <AtomButton
                    variant="link"
                    :label="$t(`${i18nPath}.registration`)"
                />
            </div>
        </div>
    </div>
</template>

<script
    setup
    lang="ts"
>
const bem = appBEM('authorization')

const i18nPath = 'forms.login'

const form = reactive({
    login: undefined,
    password: undefined,
    remember: false,
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
        border-radius: calc(var(--ui-radius) * 3);
        padding: 0.75rem;
        margin-bottom: 1rem;
        background-color: var(--surface-800);
    }

    &__form-fields {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 4);
        width: 90%;
        margin-top: 1.5rem;
    }

    &__options {
        justify-content: space-between;
        align-items: start;
    }

    &__options :deep(.hh-label) {
        font-size: 1rem;
        line-height: normal;
    }

    &__remember-hint {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    &__register {
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
    }

    &__options,
    &__register {
        display: flex;
        flex-direction: row;
        gap: calc(var(--spacing) * 2);
    }

    &__subheader,
    &__register {
        color: var(--text-secondary);
    }
}
</style>