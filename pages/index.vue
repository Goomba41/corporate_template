<script setup lang="ts">
import Button from '~/components/shared/ui/atoms/Button.vue';

import { useTheme } from '~/composables/app/useTheme';
import { useLocale } from '~/composables/app/useLocale';

import Logo from '~/assets/icons/logo.svg?component';

const {
  colorSurface,
  colorTheme,
  displayMode,
  toggleDisplayMode,
  cycleColorTheme,
  cycleColorSurface
} = useTheme()

const { appLocaleName, cycleAppLocale } = useLocale()
</script>

<template>

  <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
    <div class="flex gap-2">
      <Button label="Primary" />
      <Button label="Secondary" severity="secondary" />
      <Button label="Success" severity="success" />
      <Button label="Info" severity="info" />
      <Button label="Warn" severity="warning" />
      <Button label="Help" severity="help" />
      <Button label="Danger" severity="danger" />
    </div>

    <div class="flex gap-2">
      <Button label="Primary" variant="outlined" />
      <Button label="Secondary" severity="secondary" variant="outlined" />
      <Button label="Success" severity="success" variant="outlined" />
      <Button label="Info" severity="info" variant="outlined" />
      <Button label="Warn" severity="warning" variant="outlined" />
      <Button label="Help" severity="help" variant="outlined" />
      <Button label="Danger" severity="danger" variant="outlined" />
    </div>

    <div class="flex gap-2">
      <Button label="Primary" variant="text" />
      <Button label="Secondary" severity="secondary" variant="text" />
      <Button label="Success" severity="success" variant="text" />
      <Button label="Info" severity="info" variant="text" />
      <Button label="Warn" severity="warning" variant="text" />
      <Button label="Help" severity="help" variant="text" />
      <Button label="Danger" severity="danger" variant="text" />
    </div>
  </div>

  <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
    <div class="flex gap-2 items-center">
      <Button :label="$t('button.sizes.sm')" size="sm" />
      <Button :label="$t('button.sizes.md')" size="md" />
      <Button :label="$t('button.sizes.lg')" size="lg" />
    </div>
  </div>

  <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
    <Button />
  </div>

  <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
    <div class="flex gap-2 items-center">
      <button @click="cycleColorSurface">{{ colorSurface }}</button>
      <button @click="cycleColorTheme">{{ colorTheme }}</button>
      <button @click="toggleDisplayMode">{{ displayMode }}</button>
      <button @click="cycleAppLocale">{{ appLocaleName }}</button>
    </div>
  </div>

  <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
    <Logo width="2.875rem" height="2.875rem" />
  </div>
</template>