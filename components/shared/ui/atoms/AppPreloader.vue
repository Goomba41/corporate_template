<template>
    <Transition
        name="preloader"
        @after-leave="onHidden"
    >
        <CenteredContaner
            :class="bem().toString()"
            v-if="visible"
            :key="bem().toString()"
        >
            <div :class="bem('content')">
                <div :class="bem('brand')">
                    <img
                        src="/Hippopotamus.png"
                        alt="Hidden Hippo"
                        class="app-preloader__logo"
                        width="256"
                        height="256"
                    />
                </div>

                <div
                    v-if="progress < 100"
                    :class="bem('progress')"
                >
                    <AtomProgressBar
                        :value="progress"
                        :show-value="false"
                        :mode="progress > 0 ? 'determinate' : 'indeterminate'"
                        :class="bem('bar')"
                    />

                    <div :class="bem('loading-status')">
                        <IconUiSpinnerDefault :class="bem('status-spinner')" />
                        <div :class="bem('status-text')">
                            {{ statusText }}
                        </div>
                    </div>
                </div>
            </div>
        </CenteredContaner>
    </Transition>
</template>

<script
    setup
    lang="ts"
>
const props = withDefaults(defineProps<{
    visible: boolean
    progress?: number // 0-100
    statusText?: string
}>(), {
    visible: false,
    progress: 0,
    statusText: 'Инициализация...'
})

const emit = defineEmits<{
    hidden: [] // вызывается после завершения анимации скрытия
}>()

const onHidden = () => emit('hidden')

const bem = appBEM('app-preloader')
</script>

<style scoped>
.hh-app-preloader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--bg-secondary);
    color: var(--text-primary);
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.hh-app-preloader__content {
    text-align: center;
}

.hh-app-preloader__brand {
    position: relative;
    width: 256px;
    height: 256px;
    margin: 0 auto 1.5rem;
}

.hh-app-preloader__bar {
    height: 0.5rem;
}

.hh-app-preloader__logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: preloader-pulse 2s ease-in-out infinite;
}

.hh-app-preloader__progress {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
}

.hh-app-preloader__loading-status {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: calc(var(--spacing) * 2);
}

.hh-app-preloader__status-spinner {
    width: 1.25rem;
    height: 1.25rem;
}

/* Transition Vue */
.preloader-enter-active,
.preloader-leave-active {
    transition: opacity 0.3s ease;
}

.preloader-enter-from,
.preloader-leave-to {
    opacity: 0;
}

.preloader-leave-active {
    position: absolute;
}

/* Анимации */
@keyframes preloader-pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(0.98);
    }
}

/* Уважение prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {

    .app-preloader__logo {
        animation: none;
    }
}
</style>