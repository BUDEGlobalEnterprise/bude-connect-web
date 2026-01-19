<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}>();

const baseClasses = `
  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
  transition-all duration-200 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:pointer-events-none disabled:opacity-50
  active:scale-[0.98]
`;

const variantClasses = {
  default: 'bg-primary text-primary-foreground shadow hover:bg-primary-700 hover:shadow-md',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-red-600',
  outline: 'border border-gray-200 bg-background shadow-sm hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-gray-200',
  ghost: 'hover:bg-gray-100 hover:text-gray-900',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizeClasses = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-11 rounded-md px-8 text-base',
  icon: 'h-9 w-9',
};

const buttonClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant || 'default'],
  sizeClasses[props.size || 'default'],
  props.fullWidth && 'w-full',
]);
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="buttonClasses"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>
