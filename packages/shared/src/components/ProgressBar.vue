<template>
  <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
    <div
      class="h-full transition-all duration-500 ease-out"
      :class="colorClass"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  variant: 'default',
  showLabel: false
});

const percentage = computed(() => {
  return Math.min(100, Math.max(0, (props.value / props.max) * 100));
});

const colorClass = computed(() => {
  const variants = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };
  return variants[props.variant];
});
</script>
