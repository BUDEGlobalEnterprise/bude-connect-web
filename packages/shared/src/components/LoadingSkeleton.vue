<script setup lang="ts">
import { Skeleton } from './ui/skeleton';

interface Props {
  variant?: 'default' | 'card' | 'list' | 'profile';
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  count: 1
});
</script>

<template>
  <div class="space-y-4 w-full">
    <template v-if="variant === 'list'">
      <div v-for="i in count" :key="i" class="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton class="h-12 w-12 rounded-full" />
        <div class="space-y-2 flex-1">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </template>
    
    <template v-else-if="variant === 'card'">
      <div v-for="i in count" :key="i" class="flex flex-col space-y-3 p-4 border rounded-xl">
        <Skeleton class="h-[125px] w-full rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'profile'">
      <div class="flex flex-col items-center space-y-4">
        <Skeleton class="h-24 w-24 rounded-full" />
        <div class="space-y-2 flex flex-col items-center">
          <Skeleton class="h-6 w-[200px]" />
          <Skeleton class="h-4 w-[150px]" />
        </div>
        <div class="w-full grid grid-cols-2 gap-4 mt-6">
          <Skeleton class="h-20 rounded-lg" />
          <Skeleton class="h-20 rounded-lg" />
        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="i in count" :key="i" class="space-y-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-5/6" />
      </div>
    </template>
  </div>
</template>
