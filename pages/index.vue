<script setup lang="ts">
import Button from '~/components/shared/ui/atoms/Button.vue';

import { useTheme } from '~/composables/app/useTheme';

const { 
  colorTheme, 
  displayMode, 
  toggleDisplayMode,
  cycleColorTheme 
} = useTheme()
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
      <Button label="Small" size="sm"/>
      <Button label="Medium" size="md"/>
      <Button label="Large" size="lg"/>
    </div>
  </div>

  <!-- TODO: кнопки с loading-state, disabled-state, rounded, icon, icon-only, button-group, badge  -->

  <div class="flex flex-col flex-wrap items-center justify-center gap-2 p-2">
    <div class="flex gap-2 items-center">
      <button @click="cycleColorTheme">{{ colorTheme }}</button>
      <button @click="toggleDisplayMode">{{ displayMode }}</button>
    </div>
  </div>
</template>