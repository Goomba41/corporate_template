<script
  setup
  lang="ts"
>
import { PolicyRule } from '~/core/domain/types/password';

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

const passwordValue = ref<string>('')
const passwordValue2 = ref<string>('')

const { validationState: firstValidation, isChecking: firstIsChecking } = usePasswordStrength(passwordValue, {
  'PASSWORD_TOO_SHORT': PolicyRule.error(15),
  'PASSWORD_EXPOSED': PolicyRule.warning(),
  'PASSWORD_TOP_10': PolicyRule.warning(),
  'PASSWORD_REPEATS': PolicyRule.warning(),
  'PASSWORD_COMMON': PolicyRule.warning()
})

const { validationState: secondValidation, isChecking: secondIsChecking } = usePasswordStrength(passwordValue2, {
  'PASSWORD_TOO_SHORT': PolicyRule.error(5)
})

const progress = ref(0)

setInterval(() => {
  if (progress.value !== 100) {
    progress.value += 10
  } else {
    progress.value = 0
  }
}, 3000)

const maxPasswordScore = 4
const passwordScore = ref(0)

setInterval(() => {
  if (passwordScore.value !== 4) {
    passwordScore.value += 1
  } else {
    passwordScore.value = 0
  }
}, 3000)
</script>

<template>
  <div class="demo-grid grid grid-cols-3 gap-2 items-start p-6">
    <!-- Кнопки -->
    <div class="flex flex-col gap-2 items-center">
      <div class="flex gap-2 flex-wrap">
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

      <div class="flex gap-2 flex-wrap">
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

      <div class="flex gap-2 flex-wrap">
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

      <div class="flex gap-2 flex-wrap">
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

      <div class="flex gap-2 flex-wrap">
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
    </div>

    <!-- Поля ввода и формы -->
    <div class="flex flex-col gap-2 items-center">
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

          <AtomButton :label="$t('button.label.search')" />

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
    <div class="flex flex-col gap-2 items-center">
      <AtomMessage>{{ $t('placeholder') }}</AtomMessage>

      <div class="flex gap-2 items-center">
        <AtomMessage size="sm">Small</AtomMessage>
        <AtomMessage size="md">Medium</AtomMessage>
        <AtomMessage size="lg">Large</AtomMessage>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <AtomMessage severity="primary">{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage severity="secondary">{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage severity="success">{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage severity="info">{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage severity="warning">{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage severity="help">{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage severity="danger">{{ $t('placeholder') }}</AtomMessage>
      </div>

      <div class="flex gap-2 items-center">
        <AtomMessage
          severity="primary"
          variant="outlined"
        >{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage
          severity="secondary"
          variant="outlined"
        >{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage
          severity="success"
          variant="outlined"
        >{{ $t('placeholder') }}</AtomMessage>
      </div>

      <div class="flex gap-6 items-center">
        <AtomMessage
          severity="primary"
          variant="simple"
        >{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage
          severity="secondary"
          variant="simple"
          size="sm"
        >{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage
          severity="success"
          variant="simple"
        >{{ $t('placeholder') }}</AtomMessage>
        <AtomMessage
          severity="error"
          variant="simple"
          size="lg"
        >{{ $t('placeholder') }}</AtomMessage>
      </div>

      <div class="flex gap-2 items-center">
        <AtomMessage severity="success">
          <template #icon>
            <IconFinnTheHumanDuotone
              width="1.25rem"
              height="1.25rem"
            />
          </template>
          {{ $t('placeholder') }}
        </AtomMessage>
        <AtomMessage severity="info">
          <template #icon>
            <IconFinnTheHumanDuotone
              width="3rem"
              height="3rem"
            />
          </template>
          {{ $t('placeholder') }}
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
          {{ $t('placeholder') }}
        </AtomMessage>

        <AtomMessage
          severity="info"
          appearance="top-bottom"
          :life="5000"
          v-model:visible="visible"
          @life-end="hideMessage"
        >
          {{ $t('placeholder') }}
        </AtomMessage>
      </div>

    </div>

    <!-- Скелетоны -->
    <div class="grid grid-cols-2 gap-2 items-center">
      <div class="flex flex-col gap-2">
        <h5>Rectangle</h5>
        <AtomSkeleton animation="wave"></AtomSkeleton>
        <AtomSkeleton
          width="10rem"
          animation="wave"
        ></AtomSkeleton>
        <AtomSkeleton
          width="5rem"
          animation="wave"
        ></AtomSkeleton>
        <AtomSkeleton height="2rem"></AtomSkeleton>
        <AtomSkeleton
          width="10rem"
          height="4rem"
          animation="pulse"
        ></AtomSkeleton>
      </div>

      <div class="flex flex-col gap-2">
        <h5>Rounded</h5>
        <AtomSkeleton borderRadius="16px"></AtomSkeleton>
        <AtomSkeleton
          width="10rem"
          borderRadius="16px"
        ></AtomSkeleton>
        <AtomSkeleton
          width="5rem"
          borderRadius="16px"
        ></AtomSkeleton>
        <AtomSkeleton
          height="2rem"
          borderRadius="16px"
        ></AtomSkeleton>
        <AtomSkeleton
          width="10rem"
          height="4rem"
          borderRadius="16px"
        ></AtomSkeleton>
      </div>

      <div class="flex flex-col gap-2">
        <h5>Square</h5>
        <div class="flex gap-2 items-center">
          <AtomSkeleton size="2rem"></AtomSkeleton>
          <AtomSkeleton size="3rem"></AtomSkeleton>
          <AtomSkeleton size="4rem"></AtomSkeleton>
          <AtomSkeleton size="5rem"></AtomSkeleton>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <h5>Circle</h5>
        <div class="flex gap-2 items-center">
          <AtomSkeleton
            shape="circle"
            size="2rem"
          ></AtomSkeleton>
          <AtomSkeleton
            shape="circle"
            size="3rem"
          ></AtomSkeleton>
          <AtomSkeleton
            shape="circle"
            size="4rem"
          ></AtomSkeleton>
          <AtomSkeleton
            shape="circle"
            size="5rem"
          ></AtomSkeleton>
        </div>
      </div>
    </div>

    <!-- Пример карточки -->
    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
      <div class="flex mb-4">
        <AtomSkeleton
          shape="circle"
          size="4rem"
          class="mr-2"
        ></AtomSkeleton>
        <div>
          <AtomSkeleton
            width="10rem"
            class="mb-2"
          ></AtomSkeleton>
          <AtomSkeleton
            width="5rem"
            class="mb-2"
          ></AtomSkeleton>
          <AtomSkeleton height=".5rem"></AtomSkeleton>
        </div>
      </div>
      <AtomSkeleton
        width="100%"
        height="150px"
      ></AtomSkeleton>
      <div class="flex justify-between mt-4">
        <AtomSkeleton
          width="4rem"
          height="2rem"
        ></AtomSkeleton>
        <AtomSkeleton
          width="4rem"
          height="2rem"
        ></AtomSkeleton>
      </div>
    </div>

    <!-- Пример пульсирующей карточки -->
    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
      <div class="flex mb-4">
        <AtomSkeleton
          shape="circle"
          animation="pulse"
          size="4rem"
          class="mr-2"
        ></AtomSkeleton>
        <div>
          <AtomSkeleton
            width="10rem"
            animation="pulse"
            class="mb-2"
          ></AtomSkeleton>
          <AtomSkeleton
            width="5rem"
            animation="pulse"
            class="mb-2"
          ></AtomSkeleton>
          <AtomSkeleton
            height=".5rem"
            animation="pulse"
          ></AtomSkeleton>
        </div>
      </div>
      <AtomSkeleton
        width="100%"
        height="150px"
        animation="pulse"
      ></AtomSkeleton>
      <div class="flex justify-between mt-4">
        <AtomSkeleton
          width="4rem"
          height="2rem"
          animation="pulse"
        ></AtomSkeleton>
        <AtomSkeleton
          width="4rem"
          height="2rem"
          animation="pulse"
        ></AtomSkeleton>
      </div>
    </div>

    <AtomCard>
      <template #title>{{ $t('placeholder') }}</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </AtomCard>

    <div class="flex flex-col items-center">
      <AtomCard style="width: 25rem; overflow: hidden">
        <template #header>
          <div class="w-full flex justify-center items-center">
            <img
              alt="user header"
              src="/Hippopotamus.png"
            />
          </div>
        </template>
        <template #title>{{ $t('placeholder') }}</template>
        <template #subtitle>{{ $t('placeholder') }}</template>
        <template #content>
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
            numquam
            deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse,
            cupiditate
            neque
            quas!
          </p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <AtomButton
              :label="$t('button.label.default')"
              severity="secondary"
              variant="outlined"
              class="w-full"
            />
            <AtomButton
              :label="$t('button.label.default')"
              class="w-full"
            />
          </div>
        </template>
      </AtomCard>
    </div>

    <div class="flex flex-col gap-2 items-center">
      <h5>Passwords</h5>

      <div class="flex gap-2 items-center w-full">
        <MoleculePassword
          placeholder="Password"
          class="w-1/3"
          showClear
        >
          <template #unmaskIcon>
            <IconFinnTheHumanDuotone />
          </template>
        </MoleculePassword>
        <MoleculePassword
          disabled
          placeholder="Password"
          class="w-1/3"
        />
        <MoleculePassword
          :loading="true"
          placeholder="Password"
          class="w-1/3"
        />
      </div>
      <div class="flex gap-2 items-center w-full">
        <MoleculePassword
          v-model="passwordValue"
          placeholder="Password"
          class="w-1/3"
          :validation-state="firstValidation"
          :loading="firstIsChecking"
        >
          <template #header>
            <div class="font-semibold text-xm mb-4">Set Password for user</div>
          </template>
          <template #footer>
            <ul
              v-if="!!firstValidation.errors.length"
              class="my-0 leading-normal text-sm text-error mt-4"
            >
              <li
                v-for="(item, index) in firstValidation.errors"
                :key="index"
              >
                {{ item.message }}
              </li>
            </ul>
            <ul
              v-if="!!firstValidation.warnings.length"
              class="my-0 leading-normal text-sm text-warning mt-4"
            >
              <li
                v-for="(item, index) in firstValidation.warnings"
                :key="index"
              >
                {{ item.message }}
              </li>
            </ul>
          </template>
        </MoleculePassword>
        <MoleculePassword
          v-model="passwordValue2"
          placeholder="Password"
          class="w-1/3"
          :toggle-mask="false"
          :validation-state="secondValidation"
          :loading="secondIsChecking"
        />
        <!-- <MoleculePassword disabled placeholder="Password" class="w-1/3"/>
        <MoleculePassword :loading="true" placeholder="Password" class="w-1/3"/> -->
      </div>
    </div>

    <div class="flex flex-col gap-2 items-center">
      <h5>Progress</h5>

      <AtomCard class="w-full">
        <template #title>Basic</template>
        <template #content>
          <AtomProgressBar :value="50"></AtomProgressBar>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Dynamic</template>
        <template #content>
          <AtomProgressBar :value="progress"></AtomProgressBar>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>With custom maximum value, no caption and colors</template>
        <template #content>
          <AtomProgressBar
            :value="passwordScore"
            :max="4"
            :show-value="false"
          ></AtomProgressBar>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>With custom template</template>
        <template #content>
          <AtomProgressBar
            style="height: 1rem"
            :value="passwordScore"
            :max="maxPasswordScore"
            :show-value="false"
          >
            <span style="font-size: 0.625rem;">{{ passwordScore }}/{{ maxPasswordScore }}</span>
          </AtomProgressBar>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Indeterminate</template>
        <template #content>
          <AtomProgressBar
            style="height: 0.5rem"
            mode="indeterminate"
          />
        </template>
      </AtomCard>

    </div>
  </div>


  <div class="flex items-center justify-center mb-6 gap-4">
    <button @click="cycleColorSurface">Поверхность: {{ colorSurface }}</button>
    <button @click="cycleColorTheme">Тема: {{ colorTheme }}</button>
    <button @click="toggleDisplayMode">Режим: {{ displayMode }}</button>
    <button @click="cycleAppLocale">Язык: {{ appLocaleName }}</button>
  </div>
</template>

<style lang="scss">
.demo-grid {
  display: grid;
  gap: var(--hh-spacing-md, 1rem);
  align-items: start;

  // Mobile-first: по умолчанию 1 колонка
  grid-template-columns: 1fr;

  // Планшеты
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--hh-spacing-lg, 1.5rem);
  }

  // Десктоп
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
