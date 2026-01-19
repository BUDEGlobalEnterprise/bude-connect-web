<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <div
    :class="[
      'rounded-xl border bg-card text-card-foreground transition-all duration-200',
      // Variant styles
      variant === 'elevated' && 'shadow-md border-transparent',
      variant === 'outline' && 'border-gray-200',
      variant === 'ghost' && 'border-transparent bg-transparent',
      (!variant || variant === 'default') && 'shadow-sm border-gray-100',
      // Padding
      padding === 'none' && 'p-0',
      padding === 'sm' && 'p-4',
      (!padding || padding === 'md') && 'p-6',
      padding === 'lg' && 'p-8',
      // Interactive states
      hoverable && 'hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5',
      clickable && 'cursor-pointer hover:shadow-lg hover:border-gray-200 active:scale-[0.99]',
    ]"
    @click="clickable && emit('click')"
  >
    <slot />
  </div>
</template>
