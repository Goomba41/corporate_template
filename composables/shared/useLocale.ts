
import { ref, watch, onMounted } from 'vue'
import { useCookie } from '#app'

export const useLocale = () => {
    const { locale, locales, setLocale } = useI18n()

    type Locale = typeof locale extends globalThis.WritableComputedRef<infer T, infer S> ? T : never

    // Доступные локали, кроме текущей
    const availableLocales = computed(() => {
        return locales.value.filter(i => i.code !== locale.value)
    })

    const appLocaleCookie = useCookie<Locale>('locale', {
        default: () => 'ru'
    })

    // Код текущей локали
    const appLocale = ref<Locale>(appLocaleCookie.value)

    // Объект текущей локали
    const appLocaleObject = computed(() => locales.value.find(i => i.code === locale.value))

    // Имя текущей локали
    const appLocaleName = computed(() => appLocaleObject.value?.name ?? 'Русский')

    // Изменение локали
    const setAppLocale = (locale: Locale) => {
        appLocale.value = locale
        appLocaleCookie.value = locale
        applyLocale()
    }

    // Переключение локали (в цикле)
    const cycleAppLocale = () => {
        const allAvailableLocales = locales.value

        if (allAvailableLocales.length && appLocaleObject.value) {
            const currentIndex = allAvailableLocales.indexOf(appLocaleObject.value)
            const nextIndex = (currentIndex + 1) % allAvailableLocales.length
            setAppLocale(allAvailableLocales[nextIndex]!.code)
        }
    }

    // Применение локали
    const applyLocale = () => {
        setLocale(appLocale.value)
    }

    // Применяем локаль на клиенте
    onMounted(() => {
        applyLocale()
    })

    // Watchers
    watch(appLocale, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            appLocaleCookie.value = newVal
        }
    })

    return {
        // Состояние
        // TODO: сделать computed
        appLocale,
        appLocaleName,
        availableLocales,

        // Методы
        setAppLocale,
        cycleAppLocale,
        applyLocale
    }
}