<script setup lang="ts">
import { Separator } from 'radix-vue';
import { cn } from '../../../lib/utils';

const props = defineProps<{
  class?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}>();
</script>

<template>
  <Separator
    :orientation="orientation || 'horizontal'"
    :decorative="decorative"
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'vertical' ? 'h-full w-[1px]' : 'h-[1px] w-full',
      props.class
    )"
  />
</template>
