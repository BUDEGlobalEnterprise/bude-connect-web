<script setup lang="ts">
import { ToastProvider, type ToastProviderProps } from 'radix-vue';

const props = withDefaults(defineProps<ToastProviderProps>(), {
  swipeDirection: 'right',
});
</script>

<template>
  <ToastProvider v-bind="props">
    <slot />
  </ToastProvider>
</template>
