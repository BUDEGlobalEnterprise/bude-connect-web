<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const baseClasses = `
  inline-flex items-center font-medium transition-colors
  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
`;

const variantClasses = {
  default: 'bg-primary/10 text-primary border-transparent hover:bg-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
  success: 'bg-success/10 text-success border-transparent hover:bg-success/20',
  warning: 'bg-warning/10 text-warning-600 border-transparent hover:bg-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20',
  outline: 'bg-transparent border border-gray-200 text-foreground hover:bg-gray-50',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs rounded-md gap-1',
  md: 'px-2.5 py-1 text-xs rounded-md gap-1.5',
  lg: 'px-3 py-1.5 text-sm rounded-lg gap-2',
};

const dotClasses = {
  default: 'bg-primary',
  secondary: 'bg-gray-500',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  outline: 'bg-gray-500',
};

const badgeClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant || 'default'],
  sizeClasses[props.size || 'sm'],
]);
</script>

<template>
  <span :class="badgeClasses">
    <!-- Status Dot -->
    <span
      v-if="dot"
      :class="[
        'w-1.5 h-1.5 rounded-full',
        dotClasses[variant || 'default'],
      ]"
    />

    <!-- Content -->
    <slot />

    <!-- Remove Button -->
    <button
      v-if="removable"
      type="button"
      @click.stop="emit('remove')"
      class="ml-1 -mr-1 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center hover:bg-black/10 transition-colors"
    >
      <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
</template>
