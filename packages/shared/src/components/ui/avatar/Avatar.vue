<script setup lang="ts">
import { AvatarRoot } from 'radix-vue';
import { cn } from '../../../lib/utils';

const props = defineProps<{
  class?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>();

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};
</script>

<template>
  <AvatarRoot
    :class="cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizeClasses[size || 'md'],
      props.class
    )"
  >
    <slot />
  </AvatarRoot>
</template>
