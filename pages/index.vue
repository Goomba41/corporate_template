<script
  setup
  lang="ts"
>
import { PolicyRule, PasswordStrengthScore } from '~/types/password';

definePageMeta({
  layout: 'dashboard'
})

useTheme()

const click = () => {
  console.info('Click!')
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
  console.info('Message visibility state now is: hidden')
}

const inputTextValue = ref<string>('')

const testModelEvent = (event?: string) => {
  console.info('Text input value updated! ', event)
}

const testInputChange = (event: string) => {
  console.info('Text input value updated through change! ', event)
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

const passwordScore = ref<PasswordStrengthScore>(PasswordStrengthScore.VeryWeak)
const maxPasswordScore = computed(() => {
  const numericValues = Object.values(PasswordStrengthScore)
    .filter((v): v is number => typeof v === 'number');
  return Math.max(...numericValues)
})

setInterval(() => {
  if (passwordScore.value !== 4) {
    passwordScore.value += 1
  } else {
    passwordScore.value = 0
  }
}, 3000)

const strengthColorMap: Record<PasswordStrengthScore, string> = {
  0: 'var(--accent-error)',
  1: 'var(--accent-error)',
  2: 'var(--accent-warning)',
  3: 'var(--accent-success)',
  4: 'linear-gradient(90deg, #D4AF37, #F9E07F)',
}

const visiblePopoverFirst = ref(false)
const visiblePopoverSecond = ref(false)

const popoverBtnFirst = ref<HTMLElement | null>(null)
const popoverBtnSecond = ref<HTMLElement | null>(null)

const imperativePopoverBtnFirst = useTemplateRef('imperativePopoverBtnFirst')
const imperativePopoverBtnSecond = useTemplateRef('imperativePopoverBtnSecond')

const imperativePopoverFirst = ref()
const imperativePopoverSecond = ref()

const toggleFirst = () => {
  imperativePopoverFirst.value.toggle(imperativePopoverBtnFirst.value?.$el);
}

const toggleSecond = () => {
  imperativePopoverSecond.value.toggle(imperativePopoverBtnSecond.value?.$el);
}

const visiblePopoverAppendBody = ref(false)
const visiblePopoverAppendSelf = ref(false)
const visiblePopoverAppendHTML = ref(false)

const popoverBtnAppendBody = ref<HTMLElement | null>(null)
const popoverBtnAppendSelf = ref<HTMLElement | null>(null)
const popoverBtnAppendHTML = ref<HTMLElement | null>(null)
const popoverCardAppendHTML = useTemplateRef('popoverCardAppendHTML')

const checked = ref(false)
const reversedChecked = computed(() => !checked.value)

const triStateChecked = ref<boolean | null>(null)

const indeterminateChecked = ref<boolean | null>(null)

const categories = ref([
  { name: "Accounting", key: "A" },
  { name: "Marketing", key: "M" },
  { name: "Production", key: "P" },
  { name: "Research", key: "R" }
]);

const selectedCategories = ref(['Marketing', 'Production']);

const indeterminateCustomChecked = ref<'checked' | 'unchecked' | null>(null)
</script>

<template>
  <div class="demo-grid grid grid-cols-3 gap-2 items-start p-6">

    <!-- Кнопки -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Buttons</h2>
      <AtomCard class="w-full">
        <template #title>Basic variant with severities</template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <AtomButton label="Primary" />
            <AtomButton
              label="Secondary"
              severity="secondary"
            />
            <AtomButton
              label="Success"
              severity="success"
            />
            <AtomButton
              label="Info"
              severity="info"
            />
            <AtomButton
              label="Warning"
              severity="warning"
            />
            <AtomButton
              label="Help"
              severity="help"
            />
            <AtomButton
              label="Danger"
              severity="danger"
              class="col-span-3"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Outlined variant with severities</template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <AtomButton
              label="Primary"
              variant="outlined"
            />
            <AtomButton
              label="Secondary"
              severity="secondary"
              variant="outlined"
            />
            <AtomButton
              label="Success"
              severity="success"
              variant="outlined"
            />
            <AtomButton
              label="Info"
              severity="info"
              variant="outlined"
            />
            <AtomButton
              label="Warning"
              severity="warning"
              variant="outlined"
            />
            <AtomButton
              label="Help"
              severity="help"
              variant="outlined"
            />
            <AtomButton
              label="Danger"
              severity="danger"
              variant="outlined"
              class="col-span-3"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Text variant with severities</template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <AtomButton
              label="Primary"
              variant="text"
            />
            <AtomButton
              label="Secondary"
              severity="secondary"
              variant="text"
            />
            <AtomButton
              label="Success"
              severity="success"
              variant="text"
            />
            <AtomButton
              label="Info"
              severity="info"
              variant="text"
            />
            <AtomButton
              label="Warning"
              severity="warning"
              variant="text"
            />
            <AtomButton
              label="Help"
              severity="help"
              variant="text"
            />
            <AtomButton
              label="Danger"
              severity="danger"
              variant="text"
              class="col-span-3"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Sizes</template>
        <template #content>
          <div class="flex mt-4 justify-center gap-2 items-center">
            <AtomButton
              label="Small"
              size="sm"
              @click="click"
            />
            <AtomButton
              label="Medium"
              size="md"
              @click="click"
            />
            <AtomButton
              label="Large"
              size="lg"
              @click="click"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Rounded</template>
        <template #content>
          <div class="flex mt-4 justify-center items-center gap-2">
            <AtomButton
              label="Primary"
              rounded
            />
            <AtomButton
              label="Primary"
              variant="outlined"
              rounded
            />
            <AtomButton
              label="Primary"
              variant="text"
              rounded
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Disabled and loading state (with custom icon)</template>
        <template #content>
          <div class="mt-4 flex gap-2 justify-center items-center">
            <AtomButton
              label="Button"
              @click="click"
              disabled
            />
            <AtomButton
              label="Button"
              :loading="loading"
              @click="load"
            />
            <AtomButton
              label="Button"
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
              label="Button"
              :loading="loading"
              size="sm"
              @click="load"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Label with icon</template>
        <template #content>
          <div class="flex mt-4 gap-2 justify-center items-center">
            <AtomButton
              label="Button"
              :loading="loading"
              icon-pos="right"
              @click="load"
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
            <AtomButton
              label="Button"
              :loading="loading"
              icon-pos="top"
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
            <AtomButton
              label="Button"
              :loading="loading"
              icon-pos="bottom"
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
            <AtomButton
              label="Button"
              :loading="loading"
              @click="load"
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Only icon (with different variants and severities)</template>
        <template #content>
          <div class="flex mt-4 gap-2 justify-center items-center">
            <AtomButton
              :loading="loading"
              @click="load"
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
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
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Badge and icon (with loading state)</template>
        <template #content>
          <div class="flex mt-4 justify-center items-center gap-2 flex-wrap">
            <AtomButton
              label="Primary"
              badge="5"
              badge-severity="info"
            />
            <AtomButton
              label="Primary"
              :loading="loading"
              badge="555"
              badge-severity="info"
            />
            <AtomButton
              label="Primary"
              :loading="loading"
              badge="5"
              badge-severity="success"
            >
              <template #icon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomButton>
            <AtomButton
              label="Primary"
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
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Button groups</template>
        <template #content>
          <div class="flex mt-4 justify-center items-center gap-2">
            <MoleculeButtonGroup>
              <AtomButton label="Primary">
                <template #icon>
                  <IconFinnTheHumanDuotone />
                </template>
              </AtomButton>
              <AtomButton
                label="Primary"
                disabled
              />
              <AtomButton
                label="Primary"
                :loading="loading"
              />
            </MoleculeButtonGroup>
            <MoleculeButtonGroup>
              <AtomButton
                label="Primary"
                severity="success"
              />
              <AtomButton
                label="Primary"
                variant="outlined"
              />
              <AtomButton
                label="Primary"
                rounded
              />
            </MoleculeButtonGroup>
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Поля ввода и формы -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Text inputs</h2>

      <AtomCard class="w-full">
        <template #title>Base with v-model and events</template>
        <template #content>
          <div class="flex mt-4 justify-center gap-4 items-center w-full">
            <AtomInputText
              v-model="inputTextValue"
              :variant="inputTextValue.length ? 'filled' : undefined"
              placeholder="Input text"
              @update:modelValue="testModelEvent($event)"
              @input-change="testInputChange"
            />
            Значение: {{ inputTextValue }}
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Filled, disabled and loading states</template>
        <template #content>
          <div class="flex mt-4 justify-center gap-2 items-center w-full">
            <AtomInputText
              class="w-1/4"
              variant="filled"
              placeholder="Filled"
            />
            <AtomInputText
              class="w-1/4"
              disabled
              placeholder="Disabled"
            />
            <AtomInputText
              class="w-1/4"
              value="Filled and disabled"
              disabled
              variant="filled"
              placeholder="Filled and Disabled"
            />

            <AtomInputText
              class="w-1/4"
              :loading="true"
              placeholder="Medium"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Fluid</template>
        <template #content>
          <AtomInputText
            fluid
            class="mt-4"
            placeholder="Fluid"
          />
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Sizes</template>
        <template #content>
          <div class="flex mt-4 justify-center gap-2 items-center w-full">
            <AtomInputText
              class="w-1/3"
              placeholder="Small"
              size="sm"
            />
            <AtomInputText
              class="w-1/3"
              placeholder="Medium"
              size="md"
            />
            <AtomInputText
              class="w-1/3"
              placeholder="Large"
              size="lg"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Input groups with addons and floating label</template>
        <template #content>
          <div class="flex mt-4 flex-col gap-2 items-center justify-center w-full">
            <MoleculeInputGroup>

              <AtomInputGroupAddon>
                L
              </AtomInputGroupAddon>

              <MoleculeFloatLabel
                class="w-1/3"
                variant="over"
              >
                <template #input>
                  <AtomInputText />
                </template>
                <template #label>
                  Medium
                </template>
              </MoleculeFloatLabel>

              <AtomInputGroupAddon>
                <IconFinnTheHumanDuotone
                  width="1.125rem"
                  height="1.125rem"
                />
              </AtomInputGroupAddon>

              <MoleculeFloatLabel
                class="w-1/3"
                variant="on"
              >
                <template #input>
                  <AtomInputText />
                </template>
                <template #label>
                  Medium
                </template>
              </MoleculeFloatLabel>

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
                placeholder="Medium"
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
            <MoleculeInputGroup>

              <AtomInputGroupAddon>
                L
              </AtomInputGroupAddon>

              <AtomInputText
                placeholder="Large"
                size="lg"
              />

              <AtomInputGroupAddon>
                <IconFinnTheHumanDuotone
                  width="1.125rem"
                  height="1.125rem"
                />
              </AtomInputGroupAddon>
            </MoleculeInputGroup>
            <MoleculeInputGroup>

              <AtomButton label="Search" />

              <AtomInputText
                class="w-1/3"
                placeholder="Medium"
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
                placeholder="Medium"
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
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Help text and outer label</template>
        <template #content>
          <div class="flex mt-4 justify-center items-center gap-2">
            <div class="flex flex-col gap-1">
              <AtomLabel for="username">Username
                <IconUiAsteriskDuotone class="text-error w-[0.875rem] ml-1" />
              </AtomLabel>
              <AtomInputText id="username" />
              <AtomMessage
                size="sm"
                severity="secondary"
                variant="simple"
              >Enter your username to reset your password.</AtomMessage>
            </div>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Form field with invalid and loading (custom icon) states</template>
        <template #content>
          <div class="flex gap-2 items-start w-full">
            <MoleculeFormField class="w-1/4">
              <template #input>
                <AtomInputText placeholder="Medium" />
              </template>
            </MoleculeFormField>
            <MoleculeFormField
              class="w-1/4"
              error="Пустое поле Пустое поле Пустое поле Пустое поле Пустое поле Пустое поле"
            >
              <template #input="{ invalid }">
                <AtomInputText
                  placeholder="Medium"
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
                  placeholder="Medium"
                  :invalid="invalid"
                  size="md"
                />
              </template>
            </MoleculeFormField>
            <MoleculeFormField class="w-1/4">
              <template #input>
                <AtomInputText
                  v-model="inputTextValue"
                  :loading="loading"
                  placeholder="Medium"
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
        </template>
      </AtomCard>
    </div>

    <!-- Сообщения -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Messages</h2>

      <AtomCard class="w-full">
        <template #title>Simple message</template>
        <template #content>
          <AtomMessage>Hidden Hippo 🦛</AtomMessage>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Sizes</template>
        <template #content>
          <div class="flex gap-2 items-center">
            <AtomMessage size="sm">Small</AtomMessage>
            <AtomMessage size="md">Medium</AtomMessage>
            <AtomMessage size="lg">Large</AtomMessage>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Variants</template>
        <template #content>
          <div class="grid grid-cols-2 gap-2 items-center">
            <AtomMessage severity="primary">Hidden Hippo 🦛</AtomMessage>
            <AtomMessage severity="secondary">Hidden Hippo 🦛</AtomMessage>
            <AtomMessage severity="success">Hidden Hippo 🦛</AtomMessage>
            <AtomMessage severity="info">Hidden Hippo 🦛</AtomMessage>
            <AtomMessage severity="warning">Hidden Hippo 🦛</AtomMessage>
            <AtomMessage severity="help">Hidden Hippo 🦛</AtomMessage>
            <AtomMessage
              severity="danger"
              class="col-span-2"
            >Hidden Hippo 🦛</AtomMessage>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Variants: outlined</template>
        <template #content>
          <div class="flex gap-2 items-center">
            <AtomMessage
              severity="primary"
              variant="outlined"
            >Hidden Hippo 🦛</AtomMessage>
            <AtomMessage
              severity="secondary"
              variant="outlined"
            >Hidden Hippo 🦛</AtomMessage>
            <AtomMessage
              severity="success"
              variant="outlined"
            >Hidden Hippo 🦛</AtomMessage>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Variants: text</template>
        <template #content>
          <div class="flex gap-6 items-center">
            <AtomMessage
              severity="primary"
              variant="simple"
            >Hidden Hippo 🦛</AtomMessage>
            <AtomMessage
              severity="secondary"
              variant="simple"
              size="sm"
            >Hidden Hippo 🦛</AtomMessage>
            <AtomMessage
              severity="success"
              variant="simple"
            >Hidden Hippo 🦛</AtomMessage>
            <AtomMessage
              severity="error"
              variant="simple"
              size="lg"
            >Hidden Hippo 🦛</AtomMessage>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Icons</template>
        <template #content>
          <div class="flex gap-2 items-center">
            <AtomMessage severity="success">
              <template #icon>
                <IconFinnTheHumanDuotone
                  width="1.25rem"
                  height="1.25rem"
                />
              </template>
              Hidden Hippo 🦛
            </AtomMessage>
            <AtomMessage severity="info">
              <template #icon>
                <IconFinnTheHumanDuotone
                  width="3rem"
                  height="3rem"
                />
              </template>
              Hidden Hippo 🦛
            </AtomMessage>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Show animations</template>
        <template #content>
          <div class="flex gap-2 items-center">
            <AtomButton
              label="Show message"
              @click="showMessage"
            />

            <AtomMessage
              severity="info"
              appearance="right"
              :life="5000"
              v-model:visible="visible"
              @life-end="hideMessage"
            >
              Hidden Hippo 🦛
            </AtomMessage>

            <AtomMessage
              severity="info"
              appearance="top-bottom"
              :life="5000"
              v-model:visible="visible"
              @life-end="hideMessage"
            >
              Hidden Hippo 🦛
            </AtomMessage>
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Скелетоны -->
    <div class="flex flex-col col-span-2 gap-6 items-center">
      <h2>Skeletons</h2>

      <div class="grid grid-cols-4 gap-6 w-full">
        <AtomCard>
          <template #title>Rectangle</template>
          <template #content>
            <div class="flex flex-col gap-2">
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
          </template>
        </AtomCard>

        <AtomCard>
          <template #title>Rounded</template>
          <template #content>
            <div class="flex flex-col gap-2">
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
          </template>
        </AtomCard>

        <AtomCard>
          <template #title>Rounded</template>
          <template #content>
            <div class="flex flex-col gap-2">
              <h5>Square</h5>
              <div class="flex gap-2 items-center">
                <AtomSkeleton size="2rem"></AtomSkeleton>
                <AtomSkeleton size="3rem"></AtomSkeleton>
                <AtomSkeleton size="4rem"></AtomSkeleton>
                <AtomSkeleton size="5rem"></AtomSkeleton>
              </div>
            </div>
          </template>
        </AtomCard>

        <AtomCard>
          <template #title>Rounded</template>
          <template #content>
            <div class="flex flex-col gap-2 justify-center items-center">
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
          </template>
        </AtomCard>

        <AtomCard class="col-span-2">
          <template #title>Wave animation card</template>
          <template #content>
            <AtomCard>
              <template #content>
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
              </template>
            </AtomCard>
          </template>
        </AtomCard>

        <AtomCard class="col-span-2">
          <template #title>Pulse animation card</template>
          <template #content>
            <AtomCard>
              <template #content>
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
              </template>
            </AtomCard>
          </template>
        </AtomCard>
      </div>
    </div>

    <!-- Карточки -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Cards</h2>

      <AtomCard>
        <template #title>Simple card</template>
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
      </AtomCard>

      <AtomCard style="width: 25rem; overflow: hidden">
        <template #header>
          <div class="w-full flex justify-center items-center">
            <img
              alt="user header"
              src="/Hippopotamus.png"
            />
          </div>
        </template>
        <template #title>All feature card</template>
        <template #subtitle>Hidden Hippo 🦛</template>
        <template #content>
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
            numquam
            deserunt quisquam repellat libero asperiores earum nam
          </p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <AtomButton
              label="Button"
              severity="secondary"
              variant="outlined"
              class="w-full"
            />
            <AtomButton
              label="Button"
              class="w-full"
            />
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Пароли -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Passwords</h2>

      <AtomCard class="w-full">
        <template #title>Disabled and loading states</template>
        <template #content>
          <div class="flex gap-2 items-center w-full mt-5">
            <MoleculePassword
              disabled
              placeholder="Password"
              class="w-1/2"
            />
            <MoleculePassword
              :loading="true"
              placeholder="Password"
              class="w-1/2"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Clear icon and custom toggle icon</template>
        <template #content>
          <div class="flex gap-2 justify-center w-full mt-5">
            <MoleculePassword
              placeholder="Password"
              class="w-1/2"
              showClear
            >
              <template #unmaskIcon>
                <IconFinnTheHumanDuotone />
              </template>
            </MoleculePassword>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Validity states and custom template</template>
        <template #content>
          <div class="flex gap-2 items-center w-full mt-5">
            <MoleculePassword
              v-model="passwordValue"
              placeholder="Password"
              class="w-1/2"
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
              class="w-1/2"
              :toggle-mask="false"
              :validation-state="secondValidation"
              :loading="secondIsChecking"
            />
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Прогресс -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Progress</h2>

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
            :max="maxPasswordScore"
            :show-value="false"
            :style="{
              '--pb-fill-bg': strengthColorMap[passwordScore]
            }
              "
          />
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

      <AtomCard class="w-full">
        <template #title>Custom content</template>
        <template #content>
          <AtomProgressBar
            :value="passwordScore"
            :max="maxPasswordScore"
          >
            <template #custom="{ progress }">
              <div class="flex gap-1 h-full">
                <IconUiStar
                  v-for="i in (progress + 1)"
                  :key="i"
                  :class="['h-full w-fit', { 'text-amber-500': true }]"
                />
              </div>
            </template>
          </AtomProgressBar>
        </template>
      </AtomCard>
    </div>

    <!-- Popover -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Popover</h2>

      <AtomCard class="w-full">
        <template #title>Declarative control</template>
        <template #content>
          <div class="mt-5 flex justify-center gap-4">
            <AtomButton
              ref="popoverBtnFirst"
              :label="visiblePopoverFirst ? 'Hide Popover (dismissible)' : 'Show Popover (dismissible)'"
              @click="visiblePopoverFirst = !visiblePopoverFirst"
            />
            <AtomPopover v-model:open="visiblePopoverFirst">
              <!-- :triggerer="popoverBtnFirst" -->
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>

            <AtomButton
              ref="popoverBtnSecond"
              :label="visiblePopoverSecond ? 'Hide Popover' : 'Show Popover'"
              @click="visiblePopoverSecond = !visiblePopoverSecond"
            />
            <AtomPopover
              v-model:open="visiblePopoverSecond"
              :triggerer="popoverBtnSecond"
              :dismissible="false"
            >
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>

          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Imperative control</template>
        <template #content>
          <div class="mt-5 flex justify-center gap-4">
            <AtomButton
              ref="imperativePopoverBtnFirst"
              label="Toggle popover (dismissible)"
              @click="toggleFirst"
            />
            <AtomPopover ref="imperativePopoverFirst">
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>

            <AtomButton
              ref="imperativePopoverBtnSecond"
              label="Toggle popover"
              @click="toggleSecond"
            />
            <AtomPopover
              ref="imperativePopoverSecond"
              :dismissible="false"
              :show-arrow="true"
            >
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>
          </div>
        </template>
      </AtomCard>

      <AtomCard
        class="w-full"
        ref="popoverCardAppendHTML"
      >
        <template #title>Append to</template>
        <template #content>
          <div class="mt-5 flex justify-center gap-4">
            <AtomButton
              ref="popoverBtnAppendBody"
              :label="'To body'"
              @click="visiblePopoverAppendBody = !visiblePopoverAppendBody"
            />
            <AtomPopover
              v-model:open="visiblePopoverAppendBody"
              :triggerer="popoverBtnAppendBody"
              append-to="body"
            >
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>

            <AtomButton
              ref="popoverBtnAppendSelf"
              :label="'To self'"
              @click="visiblePopoverAppendSelf = !visiblePopoverAppendSelf"
            />
            <AtomPopover
              v-model:open="visiblePopoverAppendSelf"
              :triggerer="popoverBtnAppendSelf"
              append-to="self"
            >
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>

            <AtomButton
              ref="popoverBtnAppendHTML"
              :label="'To card'"
              @click="visiblePopoverAppendHTML = !visiblePopoverAppendHTML"
            />
            <AtomPopover
              v-model:open="visiblePopoverAppendHTML"
              :triggerer="popoverBtnAppendHTML"
              :append-to="popoverCardAppendHTML?.$el"
            >
              <div class="">
                <p>This is a popover content.</p>
                <p>You can put any content here, including forms, buttons, etc.</p>
              </div>
            </AtomPopover>
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Значки -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Badge</h2>

      <AtomCard class="w-full">
        <template #title>Basic</template>
        <template #content>
          <div class="mt-5 flex justify-center gap-4">
            <AtomBadge value="2" />
            <AtomBadge value="10" />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Severity</template>
        <template #content>
          <div class="mt-5 flex justify-center gap-4">
            <AtomBadge value="2" />
            <AtomBadge
              value="6"
              severity="secondary"
            />
            <AtomBadge
              value="8"
              severity="success"
            />
            <AtomBadge
              value="4"
              severity="info"
            />
            <AtomBadge
              value="9"
              severity="warning"
            />
            <AtomBadge
              value="3"
              severity="danger"
            />
            <AtomBadge
              value="5"
              severity="help"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Size</template>
        <template #content>
          <div class="mt-5 flex justify-center items-center gap-4">
            <AtomBadge
              value="8"
              size="xl"
              severity="success"
            />
            <AtomBadge
              value="6"
              size="lg"
              severity="warning"
            />
            <AtomBadge
              value="4"
              severity="info"
            />
            <AtomBadge
              value="2"
              size="sm"
            />
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Типографика -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Typographic</h2>

      <AtomCard class="w-full">
        <template #title>Basic</template>
        <template #content>
          <div class="mt-5 flex-col justify-center gap-4">
            <h1>Title 1</h1>
            <h2>Title 2</h2>
            <h3>Title 3</h3>
            <h4>Title 4</h4>
            <h5>Title 5</h5>
            <h6>Title 6</h6>
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Летающие подписи -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Float label</h2>

      <AtomCard class="w-full">
        <template #title>Basic</template>
        <template #content>
          <div class="grid grid-cols-3 gap-2">
            <MoleculeFloatLabel>
              <template #input>
                <AtomInputText id="username" />
              </template>
              <template #label>
                Username
              </template>
            </MoleculeFloatLabel>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Variants</template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2 items-end">
            <MoleculeFloatLabel variant="over">
              <template #input>
                <AtomInputText id="username" />
              </template>
              <template #label>
                Username (over)
              </template>
            </MoleculeFloatLabel>

            <MoleculeFloatLabel variant="in">
              <template #input>
                <AtomInputText id="username" />
              </template>
              <template #label>
                Username (in)
              </template>
            </MoleculeFloatLabel>

            <MoleculeFloatLabel variant="on">
              <template #input>
                <AtomInputText id="username" />
              </template>
              <template #label>
                Username (on)
              </template>
            </MoleculeFloatLabel>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Invalid</template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2 items-end">
            <MoleculeFloatLabel
              variant="over"
              :required="true"
            >
              <template #input>
                <AtomInputText
                  id="username"
                  :invalid="!inputTextValue"
                  v-model="inputTextValue"
                />
              </template>
              <template #label>
                Username (over)
              </template>
            </MoleculeFloatLabel>

            <MoleculeFloatLabel variant="in">
              <template #input>
                <AtomInputText
                  id="username"
                  :invalid="!inputTextValue"
                  v-model="inputTextValue"
                />
              </template>
              <template #label>
                Username (in)
              </template>
            </MoleculeFloatLabel>

            <MoleculeFloatLabel variant="on">
              <template #input>
                <AtomInputText
                  id="username"
                  :invalid="!inputTextValue"
                  v-model="inputTextValue"
                />
              </template>
              <template #label>
                Username (on)
              </template>
            </MoleculeFloatLabel>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>With Form Field and custom label</template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <MoleculeFormField
              :required="true"
              :error="!inputTextValue ? 'Обязательное поле' : undefined"
            >
              <template #input="{ invalid }">
                <MoleculeFloatLabel :required="true">
                  <template #label>ФИО пациента</template>
                  <template #input="{ id }">
                    <AtomInputText
                      :id="id"
                      v-model="inputTextValue"
                      :invalid="invalid"
                    />
                  </template>
                </MoleculeFloatLabel>
              </template>
            </MoleculeFormField>

            <MoleculeFormField
              :required="true"
              :error="!inputTextValue ? 'Обязательное поле' : undefined"
            >
              <template #input="{ invalid }">
                <MoleculeFloatLabel :required="true">
                  <template #label>
                    <span class="flex items-center gap-1">
                      Дата приёма
                      <AtomBadge
                        severity="info"
                        value="1"
                        size="sm"
                      />
                    </span>

                  </template>
                  <template #input="{ id }">
                    <AtomInputText
                      :id="id"
                      v-model="inputTextValue"
                      :invalid="invalid"
                    />
                  </template>
                </MoleculeFloatLabel>
              </template>
            </MoleculeFormField>
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Флаги -->
    <div class="flex flex-col gap-6 items-center">
      <h2>Checkbox</h2>

      <AtomCard class="w-full">
        <template #title>Basic, disabled, invalid, filled</template>
        <template #content>
          <div class="mt-4 flex gap-4">
            <AtomCheckbox v-model="checked" />
            <AtomCheckbox
              v-model="checked"
              disabled
            />
            <AtomCheckbox
              v-model="reversedChecked"
              disabled
            />
            <AtomCheckbox
              v-model="checked"
              :invalid="true"
            />
            <AtomCheckbox
              v-model="checked"
              :invalid="true"
              :variant="'filled'"
            />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Sizes</template>
        <template #content>
          <div class="mt-4 flex gap-4 justify-center items-center">
            <AtomCheckbox size="sm" />
            <AtomCheckbox size="md" />
            <AtomCheckbox size="lg" />
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Dynamic and group</template>
        <template #content>
          <div class="mt-4 flex gap-4 justify-center items-center justify-self-center">
            <div class="flex flex-col gap-4 justify-center items-start w-fit justify-self-center">
              <div
                v-for="category of categories"
                :key="category.key"
                class="flex items-center gap-2"
              >
                <AtomCheckbox
                  v-model="selectedCategories"
                  :inputId="category.key"
                  :value="category.name"
                />
                <label :for="category.key">{{ category.name }}</label>
              </div>
            </div>

            <div class="w-1/3 min-w-1/3">
              Value: {{ selectedCategories }}
            </div>
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Tri-state</template>
        <template #content>
          <div class="mt-4 flex gap-4 justify-center items-start w-fit justify-self-center">
            <AtomCheckbox
              v-model="triStateChecked"
              :indeterminate="true"
            />

            Value: {{ typeof triStateChecked === 'boolean' ? triStateChecked : 'null' }}
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Indeterminate</template>
        <template #content>
          <div class="mt-4 flex gap-4 justify-center items-start w-fit justify-self-center">
            <AtomCheckbox v-model="indeterminateChecked" />

            Value: {{ typeof indeterminateChecked === 'boolean' ? indeterminateChecked : 'null' }}
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Custom true/false values</template>
        <template #content>
          <div class="mt-4 flex gap-4 justify-center items-start w-fit justify-self-center">
            <AtomCheckbox
              v-model="indeterminateCustomChecked"
              :false-value="'unchecked'"
              :true-value="'checked'"
            />

            Value: {{ indeterminateCustomChecked === null ? 'null' : indeterminateCustomChecked }}
          </div>
        </template>
      </AtomCard>

      <AtomCard class="w-full">
        <template #title>Custom icons</template>
        <template #content>
          <div class="mt-4 flex flex-col gap-4 justify-center items-start w-fit justify-self-center">
            <AtomCheckbox v-model="indeterminateChecked">
              <template #indeterminateIcon>
                <IconUiXCircle />
              </template>
              <template #checkedIcon>
                <IconFinnTheHumanDuotone />
              </template>
            </AtomCheckbox>
          </div>
        </template>
      </AtomCard>
    </div>

    <!-- Шаблон для последующей вставки новой секции -->
    <!-- <div class="flex flex-col gap-6 items-center">
      <h2></h2>

      <AtomCard class="w-full">
        <template #title></template>
        <template #content>
          <div class="mt-4 grid grid-cols-3 gap-2">
            
          </div>
        </template>
      </AtomCard>
    </div> -->

  </div>
</template>

<style lang="scss">
.demo-grid {
  display: grid;
  gap: calc(var(--spacing) * 4);
  align-items: start;

  // Mobile-first: по умолчанию 1 колонка
  grid-template-columns: 1fr;

  // Планшеты
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing) * 6);
  }

  // Десктоп
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
