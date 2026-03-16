import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime';


import Button from '~/components/shared/ui/atoms/Button.vue'


describe('Компонент «Кнопка»', () => {
    it('Отображается со свойствами по умолчанию', async () => {
        // Монтируем компонент с дефолтными пропсами
        const wrapper = await mountSuspended(Button)

        // Проверяем, что компонент рендерится
        expect(wrapper.exists()).toBe(true)

        // Проверяем, что кнопка имеет правильные классы по умолчанию
        const primeButton = wrapper.find('.btn')
        expect(primeButton.exists()).toBe(true)
        expect(primeButton.classes()).toContain('btn-primary') // severity: 'primary' по умолчанию
        expect(primeButton.classes()).toContain('btn-md')      // size: 'md' по умолчанию

        // Проверяем, что лейбл по умолчанию отображается
        // (используем мок $t, который возвращает ключ)
        // expect(wrapper.text()).toContain('button.label.default')
    })
})