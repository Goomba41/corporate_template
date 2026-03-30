import { zxcvbnOptions } from '@zxcvbn-ts/core';
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

export default defineNuxtPlugin(() => {
    // Предварительная инициализация базовых опций
    zxcvbnOptions.setOptions({
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
        },
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        translations: zxcvbnEnPackage.translations,
    }); // Теперь use-case не будет гонять setOptions каждый раз

    if (import.meta.client && navigator.onLine && location.protocol === 'https:') {
        if (!zxcvbnOptions.matchers['pwned']) {
            zxcvbnOptions.addMatcher(
                'pwned',
                matcherPwnedFactory(fetch, zxcvbnOptions)
            )
        }
    }
});