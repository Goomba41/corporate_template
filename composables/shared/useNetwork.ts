// composables/shared/useNetwork.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useNetwork() {
    // Инициализируем true, на сервере считаем что сеть есть
    const isOnline = ref(true);
    const isOffline = computed(() => !isOnline.value);
    const isHttps = ref(false);
    const isHttp = computed(() => !isHttps.value)

    const updateStatus = () => {
        if (navigator.onLine) {
            console.info('App is now online')
        } else {
            console.warn('App is now offline')
        }
        isOnline.value = navigator.onLine;
        isHttps.value = window.crypto?.subtle && window.isSecureContext
    };

    // Подписка только на клиенте
    if (import.meta.client) {
        onMounted(() => {
            updateStatus(); // Начальное значение
            window.addEventListener('online', updateStatus);
            window.addEventListener('offline', updateStatus);
        });

        onUnmounted(() => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        });
    }

    return {
        isOnline,
        isOffline,
        isHttp,
        isHttps
    };
}