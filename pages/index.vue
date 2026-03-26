<script
  setup
  lang="ts"
>
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

const inputTextValue = ref<string>('')

const testModelEvent = (event?: string) => {
  console.log('Text input value updated! ', event)
}

const testInputChange = (event: string) => {
  console.log('Text input value updated through change! ', event)
}
</script>

<template>
  <div class="flex gap-2">
    <div class="flex flex-col gap-2 p-2 items-center">

      <!-- Кнопки -->
      <div class="flex gap-2">
        <AtomButton :label="$t('button.severities.primary')" />
        <AtomButton
          :label="$t('button.severities.secondary')"
          severity="secondary"
        />
        <AtomButton
          :label="$t('button.severities.success')"
          severity="success"
        />
        <AtomButton
          :label="$t('button.severities.info')"
          severity="info"
        />
        <AtomButton
          :label="$t('button.severities.warning')"
          severity="warning"
        />
        <AtomButton
          :label="$t('button.severities.help')"
          severity="help"
        />
        <AtomButton
          :label="$t('button.severities.danger')"
          severity="danger"
        />
      </div>

      <div class="flex gap-2">
        <AtomButton
          :label="$t('button.severities.primary')"
          variant="outlined"
        />
        <AtomButton
          :label="$t('button.severities.secondary')"
          severity="secondary"
          variant="outlined"
        />
        <AtomButton
          :label="$t('button.severities.success')"
          severity="success"
          variant="outlined"
        />
        <AtomButton
          :label="$t('button.severities.info')"
          severity="info"
          variant="outlined"
        />
        <AtomButton
          :label="$t('button.severities.warning')"
          severity="warning"
          variant="outlined"
        />
        <AtomButton
          :label="$t('button.severities.help')"
          severity="help"
          variant="outlined"
        />
        <AtomButton
          :label="$t('button.severities.danger')"
          severity="danger"
          variant="outlined"
        />
      </div>

      <div class="flex gap-2">
        <AtomButton
          :label="$t('button.severities.primary')"
          variant="text"
        />
        <AtomButton
          :label="$t('button.severities.secondary')"
          severity="secondary"
          variant="text"
        />
        <AtomButton
          :label="$t('button.severities.success')"
          severity="success"
          variant="text"
        />
        <AtomButton
          :label="$t('button.severities.info')"
          severity="info"
          variant="text"
        />
        <AtomButton
          :label="$t('button.severities.warning')"
          severity="warning"
          variant="text"
        />
        <AtomButton
          :label="$t('button.severities.help')"
          severity="help"
          variant="text"
        />
        <AtomButton
          :label="$t('button.severities.danger')"
          severity="danger"
          variant="text"
        />
      </div>

      <div class="flex gap-2">
        <AtomButton
          :label="$t('button.severities.primary')"
          badge="5"
          badge-severity="info"
        />
        <AtomButton
          :label="$t('button.severities.primary')"
          :loading="loading"
          badge="555"
          badge-severity="info"
        />
        <AtomButton
          :label="$t('button.severities.primary')"
          :loading="loading"
          badge="5"
          badge-severity="success"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :label="$t('button.severities.primary')"
          :loading="loading"
          icon-pos="right"
          badge="5"
          badge-severity="help"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
      </div>

      <div class="flex gap-2">
        <MoleculeButtonGroup>
          <AtomButton :label="$t('button.severities.primary')">
            <template #icon>
              <IconFinnTheHumanDuotone />
            </template>
          </AtomButton>
          <AtomButton
            :label="$t('button.severities.primary')"
            disabled
          />
          <AtomButton
            :label="$t('button.severities.primary')"
            :loading="loading"
          />
        </MoleculeButtonGroup>
      </div>

      <div class="flex gap-2">
        <MoleculeButtonGroup>
          <AtomButton
            :label="$t('button.severities.primary')"
            severity="success"
          />
          <AtomButton
            :label="$t('button.severities.primary')"
            variant="outlined"
          />
          <AtomButton
            :label="$t('button.severities.primary')"
            rounded
          />
        </MoleculeButtonGroup>
      </div>

      <div class="flex gap-2">
        <AtomButton
          :label="$t('button.severities.primary')"
          rounded
        />
        <AtomButton
          :label="$t('button.severities.primary')"
          variant="outlined"
          rounded
        />
        <AtomButton
          :label="$t('button.severities.primary')"
          variant="text"
          rounded
        />
      </div>

      <div class="flex gap-2 items-center">
        <AtomButton
          :label="$t('button.sizes.sm')"
          size="sm"
          @click="click"
        />
        <AtomButton
          :label="$t('button.sizes.md')"
          size="md"
          @click="click"
        />
        <AtomButton
          :label="$t('button.sizes.lg')"
          size="lg"
          @click="click"
        />
      </div>

      <div class="flex gap-2 items-center">
        <AtomButton
          :label="$t('button.label.default')"
          @click="click"
          disabled
        />
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          @click="load"
        />
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          @click="load"
        >
          <template #loadingIcon>
            <IconUiSpinnerResize
              height="1.25em"
              width="1.25em"
            />
          </template>
        </AtomButton>
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          size="sm"
          @click="load"
        />
      </div>

      <div class="flex gap-2 items-center">
        <AtomButton
          :loading="loading"
          @click="load"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          @click="load"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          icon-pos="right"
          @click="load"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
      </div>

      <div class="flex gap-2 items-center">
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          icon-pos="top"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :label="$t('button.label.default')"
          :loading="loading"
          icon-pos="bottom"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
      </div>

      <div class="flex gap-2 items-center">
        <AtomButton
          :loading="loading"
          rounded
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :loading="loading"
          severity="secondary"
          rounded
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :loading="loading"
          severity="success"
          size="sm"
          rounded
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :loading="loading"
          severity="info"
          rounded
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :loading="loading"
          severity="warning"
          size="lg"
          rounded
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :loading="loading"
          severity="help"
          variant="outlined"
          rounded
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
        <AtomButton
          :loading="loading"
          severity="danger"
          variant="text"
          rounded
          @click="showMessage"
        >
          <template #icon>
            <IconFinnTheHumanDuotone />
          </template>
        </AtomButton>
      </div>

      <!-- Лого -->
      <IconBrandLogo
        width="2.875rem"
        height="2.875rem"
      />

      <!-- Бэйджи -->
      <div class="flex gap-2 items-center">
        <AtomBadge
          value="88"
          size="xl"
          severity="success"
          circle
        ></AtomBadge>
        <AtomBadge
          value="6"
          size="lg"
          severity="warning"
          circle
        ></AtomBadge>
        <AtomBadge
          value="4"
          severity="info"
        ></AtomBadge>
        <AtomBadge
          value="2"
          size="sm"
        ></AtomBadge>
      </div>
    </div>

    <!-- Поля ввода и формы -->
    <div class="flex flex-col gap-2 p-2 items-center">
      <div class="flex gap-2 items-center w-full">
        <AtomInputText
          v-model="inputTextValue"
          :variant="inputTextValue.length ? 'filled' : undefined"
          :placeholder="$t('input-text.label.default')"
          @update:modelValue="testModelEvent($event)"
          @input-change="testInputChange"
        />
        Значение: {{ inputTextValue }}
      </div>

      <AtomInputText
        fluid
        :placeholder="$t('input-text.sizes.fluid')"
      />

      <div class="flex gap-2 items-center w-full">
        <AtomInputText
          class="w-1/3"
          variant="filled"
          :placeholder="$t('input-text.variants.filled')"
        />
        <AtomInputText
          class="w-1/3"
          disabled
          :placeholder="$t('input-text.variants.disabled')"
        />
        <AtomInputText
          class="w-1/3"
          value="Filled and disabled"
          disabled
          variant="filled"
          :placeholder="`${$t('input-text.variants.filled')} ${$t('input-text.variants.disabled')}`"
        />
      </div>

      <div class="flex gap-2 items-center w-full">
        <AtomInputText
          class="w-1/3"
          :placeholder="$t('input-text.sizes.sm')"
          size="sm"
        />
        <AtomInputText
          class="w-1/3"
          :placeholder="$t('input-text.sizes.md')"
          size="md"
        />
        <AtomInputText
          class="w-1/3"
          :placeholder="$t('input-text.sizes.lg')"
          size="lg"
        />
      </div>

      <div class="flex gap-2 items-start w-full">
        <MoleculeFormField
          class="w-1/4"
          error="Пустое поле Пустое поле Пустое поле Пустое поле Пустое поле Пустое поле"
        >
          <template #input="{ invalid }">
            <AtomInputText
              :placeholder="$t('input-text.sizes.md')"
              :invalid="invalid"
              size="md"
            />
          </template>
        </MoleculeFormField>
        <MoleculeFormField
          class="w-1/4"
          error="Пустое поле Пустое поле Пустое поле Пустое поле Пустое поле Пустое поле"
          :error-lines="2"
        >
          <template #input="{ invalid }">
            <AtomInputText
              :placeholder="$t('input-text.sizes.md')"
              :invalid="invalid"
              size="md"
            />
          </template>
        </MoleculeFormField>
        <MoleculeFormField class="w-1/4">
          <template #input>
            <AtomInputText :placeholder="$t('input-text.sizes.md')" />
          </template>
        </MoleculeFormField>
        <MoleculeFormField class="w-1/4">
          <template #input>
            <AtomInputText
              v-model="inputTextValue"
              :loading="loading"
              :placeholder="$t('input-text.sizes.md')"
            >
              <template #loadingIcon>
                <IconUiSpinnerResize
                  height="1.25em"
                  width="1.25em"
                />
              </template>
            </AtomInputText>
          </template>
        </MoleculeFormField>
      </div>

      <div class="flex gap-2 items-center">
        <AtomInputText
          :loading="true"
          :placeholder="$t('input-text.sizes.md')"
        />
        <AtomInputText
          v-model="inputTextValue"
          :loading="true"
          :placeholder="$t('input-text.sizes.md')"
        />
      </div>

      <div class="flex gap-2 items-center w-full">
        <MoleculeInputGroup class="w-full">

          <AtomInputGroupAddon>
            L
          </AtomInputGroupAddon>

          <AtomInputText
            class="w-1/3"
            :placeholder="$t('input-text.sizes.md')"
          />

          <AtomInputGroupAddon>
            <IconFinnTheHumanDuotone
              width="1.125rem"
              height="1.125rem"
            />
          </AtomInputGroupAddon>

          <AtomInputText
            class="w-1/3"
            :placeholder="$t('input-text.sizes.md')"
          />

          <AtomInputGroupAddon>
            $
          </AtomInputGroupAddon>
          <AtomInputGroupAddon>
            M
          </AtomInputGroupAddon>

          <AtomInputText
            v-model="inputTextValue"
            class="w-1/3"
            :loading="loading"
            :placeholder="$t('input-text.sizes.md')"
          >
            <template #loadingIcon>
              <IconUiSpinnerResize
                height="1.25em"
                width="1.25em"
              />
            </template>
          </AtomInputText>

          <AtomInputGroupAddon>
            R
          </AtomInputGroupAddon>
        </MoleculeInputGroup>
      </div>

      <div class="flex gap-2 items-center w-full">
        <MoleculeInputGroup class="w-full">

          <AtomInputGroupAddon>
            L
          </AtomInputGroupAddon>

          <AtomInputText
            class="w-1/3"
            :placeholder="$t('input-text.sizes.lg')"
            size="lg"
          />

          <AtomInputGroupAddon>
            <IconFinnTheHumanDuotone
              width="1.125rem"
              height="1.125rem"
            />
          </AtomInputGroupAddon>
        </MoleculeInputGroup>
      </div>

      <div class="flex gap-2 items-center w-full">
        <MoleculeInputGroup class="w-full">

          <AtomButton label="Search" />

          <AtomInputText
            class="w-1/3"
            :placeholder="$t('input-text.sizes.md')"
          />

          <AtomInputGroupAddon>
            <AtomButton
              label="m"
              severity="secondary"
              variant="text"
            />
          </AtomInputGroupAddon>

          <AtomInputText
            v-model="inputTextValue"
            class="w-1/3"
            :loading="loading"
            :placeholder="$t('input-text.sizes.md')"
          >
            <template #loadingIcon>
              <IconUiSpinnerResize
                height="1.25em"
                width="1.25em"
              />
            </template>
          </AtomInputText>

          <AtomInputGroupAddon>
            <AtomButton
              label="r"
              severity="secondary"
            />
          </AtomInputGroupAddon>
        </MoleculeInputGroup>
      </div>

      <div class="flex gap-2 items-center">
        <div class="flex flex-col gap-1">
          <AtomLabel
            for="username"
            :required="true"
          >Username</AtomLabel>
          <AtomInputText id="username" />
          <AtomMessage
            size="sm"
            severity="secondary"
            variant="simple"
          >Enter your username to reset your password.</AtomMessage>
        </div>
      </div>
    </div>

    <!-- Сообщения -->
    <div class="flex flex-col gap-2 p-2 items-center">
      <AtomMessage>Привет</AtomMessage>

      <div class="flex gap-2 items-center">
        <AtomMessage size="sm">Small</AtomMessage>
        <AtomMessage size="md">Medium</AtomMessage>
        <AtomMessage size="lg">Large</AtomMessage>
      </div>

      <div class="flex gap-2 items-center">
        <AtomMessage severity="primary">Привет</AtomMessage>
        <AtomMessage severity="secondary">Привет</AtomMessage>
        <AtomMessage severity="success">Привет</AtomMessage>
        <AtomMessage severity="info">Привет</AtomMessage>
        <AtomMessage severity="warning">Привет</AtomMessage>
        <AtomMessage severity="help">Привет</AtomMessage>
        <AtomMessage severity="danger">Привет</AtomMessage>
      </div>

      <div class="flex gap-2 items-center">
        <AtomMessage
          severity="primary"
          variant="outlined"
        >Привет</AtomMessage>
        <AtomMessage
          severity="secondary"
          variant="outlined"
        >Привет</AtomMessage>
        <AtomMessage
          severity="success"
          variant="outlined"
        >Привет</AtomMessage>
      </div>

      <div class="flex gap-6 items-center">
        <AtomMessage
          severity="primary"
          variant="simple"
        >Привет</AtomMessage>
        <AtomMessage
          severity="secondary"
          variant="simple"
          size="sm"
        >Привет</AtomMessage>
        <AtomMessage
          severity="success"
          variant="simple"
        >Привет</AtomMessage>
        <AtomMessage
          severity="error"
          variant="simple"
          size="lg"
        >Привет</AtomMessage>
      </div>

      <div class="flex gap-2 items-center">
        <AtomMessage severity="success">
          <template #icon>
            <IconFinnTheHumanDuotone
              width="1.25rem"
              height="1.25rem"
            />
          </template>
          Привет
        </AtomMessage>
        <AtomMessage severity="info">
          <template #icon>
            <IconFinnTheHumanDuotone
              width="3rem"
              height="3rem"
            />
          </template>
          Привет
        </AtomMessage>
      </div>

      <div class="flex gap-2 items-center">
        <AtomMessage
          severity="info"
          appearance="right"
          :life="5000"
          v-model:visible="visible"
          @life-end="hideMessage"
        >
          Привет
        </AtomMessage>

        <AtomMessage
          severity="info"
          appearance="top-bottom"
          :life="5000"
          v-model:visible="visible"
          @life-end="hideMessage"
        >
          Привет
        </AtomMessage>
      </div>

    </div>
  </div>

  <div class="flex flex-col items-center justify-center mt-6">
    <button @click="cycleColorSurface">Поверхность: {{ colorSurface }}</button>
    <button @click="cycleColorTheme">Тема: {{ colorTheme }}</button>
    <button @click="toggleDisplayMode">Режим: {{ displayMode }}</button>
    <button @click="cycleAppLocale">Язык: {{ appLocaleName }}</button>
  </div>
</template>