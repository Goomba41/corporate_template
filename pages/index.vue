<script
  setup
  lang="ts"
>
import Button from '~/components/shared/ui/atoms/Button.vue';
import InputText from '~/components/shared/ui/atoms/InputText.vue';
import Message from '~/components/shared/ui/atoms/Message.vue';

import { useTheme } from '~/composables/app/useTheme';
import { useLocale } from '~/composables/app/useLocale';

import Finn from '~/assets/icons/finnTheHumanDuotone.svg?component';
import Logo from '~/assets/icons/logo.svg?component';
import Spinner from '~/assets/icons/spinnerResize.svg?component';
import FormField from '~/components/shared/ui/molecules/FormField.vue';

const {
  colorSurface,
  colorTheme,
  displayMode,
  toggleDisplayMode,
  cycleColorTheme,
  cycleColorSurface
} = useTheme()

const { appLocaleName, cycleAppLocale } = useLocale()

const click = () => {
  console.log('Click!')
}

const loading = ref(false);

const load = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
}

const visible = ref(false)

const showMessage = () => {
  visible.value = true;
}

const hideMessage = () => {
  console.log('Message visibility state now is: hidden')
}
</script>

<template>
  <div class="flex gap-2">
    <div class="flex flex-col gap-2 p-2 items-center">
      <div class="flex gap-2">
        <Button :label="$t('button.severities.primary')" />
        <Button
          :label="$t('button.severities.secondary')"
          severity="secondary"
        />
        <Button
          :label="$t('button.severities.success')"
          severity="success"
        />
        <Button
          :label="$t('button.severities.info')"
          severity="info"
        />
        <Button
          :label="$t('button.severities.warning')"
          severity="warning"
        />
        <Button
          :label="$t('button.severities.help')"
          severity="help"
        />
        <Button
          :label="$t('button.severities.danger')"
          severity="danger"
        />
      </div>

      <div class="flex gap-2">
        <Button
          :label="$t('button.severities.primary')"
          variant="outlined"
        />
        <Button
          :label="$t('button.severities.secondary')"
          severity="secondary"
          variant="outlined"
        />
        <Button
          :label="$t('button.severities.success')"
          severity="success"
          variant="outlined"
        />
        <Button
          :label="$t('button.severities.info')"
          severity="info"
          variant="outlined"
        />
        <Button
          :label="$t('button.severities.warning')"
          severity="warning"
          variant="outlined"
        />
        <Button
          :label="$t('button.severities.help')"
          severity="help"
          variant="outlined"
        />
        <Button
          :label="$t('button.severities.danger')"
          severity="danger"
          variant="outlined"
        />
      </div>

      <div class="flex gap-2">
        <Button
          :label="$t('button.severities.primary')"
          variant="text"
        />
        <Button
          :label="$t('button.severities.secondary')"
          severity="secondary"
          variant="text"
        />
        <Button
          :label="$t('button.severities.success')"
          severity="success"
          variant="text"
        />
        <Button
          :label="$t('button.severities.info')"
          severity="info"
          variant="text"
        />
        <Button
          :label="$t('button.severities.warning')"
          severity="warning"
          variant="text"
        />
        <Button
          :label="$t('button.severities.help')"
          severity="help"
          variant="text"
        />
        <Button
          :label="$t('button.severities.danger')"
          severity="danger"
          variant="text"
        />
      </div>

      <div class="flex gap-2">
        <Button
          :label="$t('button.severities.primary')"
          rounded
        />
        <Button
          :label="$t('button.severities.primary')"
          variant="outlined"
          rounded
        />
        <Button
          :label="$t('button.severities.primary')"
          variant="text"
          rounded
        />
      </div>

      <div class="flex gap-2 items-center">
        <Button
          :label="$t('button.sizes.sm')"
          size="sm"
          @click="click"
        />
        <Button
          :label="$t('button.sizes.md')"
          size="md"
          @click="click"
        />
        <Button
          :label="$t('button.sizes.lg')"
          size="lg"
          @click="click"
        />
      </div>

      <div class="flex gap-2 items-center">
        <Button
          :label="$t('button.label.default')"
          @click="click"
          disabled
        />
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          @click="load"
        />
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          @click="load"
        >
          <template #loadingIcon>
            <Spinner
              height="1.25em"
              width="1.25em"
            />
          </template>
        </Button>
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          size="sm"
          @click="load"
        />
      </div>

      <div class="flex gap-2 items-center">
        <Button
          :loading="loading"
          @click="load"
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          @click="load"
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          icon-pos="right"
          @click="load"
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
      </div>

      <div class="flex gap-2 items-center">
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          icon-pos="top"
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :label="$t('button.label.default')"
          :loading="loading"
          icon-pos="bottom"
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
      </div>

      <div class="flex gap-2 items-center">
        <Button
          :loading="loading"
          rounded
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :loading="loading"
          severity="secondary"
          rounded
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :loading="loading"
          severity="success"
          size="sm"
          rounded
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :loading="loading"
          severity="info"
          rounded
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :loading="loading"
          severity="warning"
          size="lg"
          rounded
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :loading="loading"
          severity="help"
          variant="outlined"
          rounded
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
        <Button
          :loading="loading"
          severity="danger"
          variant="text"
          rounded
          @click="showMessage"
        >
          <template #icon>
            <Finn />
          </template>
        </Button>
      </div>

      <div class="flex gap-2 items-center">
        <button @click="cycleColorSurface">{{ colorSurface }}</button>
        <button @click="cycleColorTheme">{{ colorTheme }}</button>
        <button @click="toggleDisplayMode">{{ displayMode }}</button>
        <button @click="cycleAppLocale">{{ appLocaleName }}</button>
      </div>

      <Logo
        width="2.875rem"
        height="2.875rem"
      />
    </div>

    <div class="flex flex-col gap-2 p-2 items-center">
      <InputText />

      <div class="flex gap-2 items-center">
        <InputText
          :placeholder="$t('input-text.sizes.sm')"
          size="sm"
        />
        <InputText
          :placeholder="$t('input-text.sizes.md')"
          size="md"
        />
        <InputText
          :placeholder="$t('input-text.sizes.lg')"
          size="lg"
        />
      </div>

      <div class="flex gap-2 items-center">
        <FormField error="Пустое поле">
          <template #input="{ invalid }">
            <InputText
              :placeholder="$t('input-text.sizes.md')"
              :invalid="invalid"
              size="md"
            />
          </template>
        </FormField>
        <FormField>
          <template #input>
            <InputText :placeholder="$t('input-text.sizes.md')" />
          </template>
        </FormField>
      </div>
    </div>

    <div class="flex flex-col gap-2 p-2 items-center">
      <Message>Привет</Message>

      <div class="flex gap-2 items-center">
        <Message size="sm">Small</Message>
        <Message size="md">Medium</Message>
        <Message size="lg">Large</Message>
      </div>

      <div class="flex gap-2 items-center">
        <Message severity="primary">Привет</Message>
        <Message severity="secondary">Привет</Message>
        <Message severity="success">Привет</Message>
        <Message severity="info">Привет</Message>
        <Message severity="warning">Привет</Message>
        <Message severity="help">Привет</Message>
        <Message severity="danger">Привет</Message>
      </div>

      <div class="flex gap-2 items-center">
        <Message
          severity="primary"
          variant="outlined"
        >Привет</Message>
        <Message
          severity="secondary"
          variant="outlined"
        >Привет</Message>
        <Message
          severity="success"
          variant="outlined"
        >Привет</Message>
      </div>

      <div class="flex gap-6 items-center">
        <Message
          severity="primary"
          variant="simple"
        >Привет</Message>
        <Message
          severity="secondary"
          variant="simple"
        >Привет</Message>
        <Message
          severity="success"
          variant="simple"
        >Привет</Message>
        <Message
          severity="error"
          variant="simple"
        >Привет</Message>
      </div>

      <div class="flex gap-2 items-center">
        <Message severity="success">
          <template #icon>
            <Finn
              width="1.25rem"
              height="1.25rem"
            />
          </template>
          Привет
        </Message>
        <Message severity="info">
          <template #icon>
            <Finn
              width="3rem"
              height="3rem"
            />
          </template>
          Привет
        </Message>
      </div>

      <div class="flex gap-2 items-center">
        <Message
          severity="info"
          appearance="right"
          :life="5000"
          v-model:visible="visible"
          @life-end="hideMessage"
        >
          Привет
        </Message>

        <Message
          severity="info"
          appearance="top-bottom"
          :life="5000"
          v-model:visible="visible"
          @life-end="hideMessage"
        >
          Привет
        </Message>
      </div>

    </div>
  </div>
</template>