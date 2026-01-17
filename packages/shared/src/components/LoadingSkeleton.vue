<script setup lang="ts">
defineProps<{
  variant?: "card" | "list" | "text";
  count?: number;
}>();
</script>

<template>
  <div class="animate-pulse">
    <!-- Card Skeleton -->
    <template v-if="variant === 'card' || !variant">
      <div class="aspect-square bg-gray-200 rounded-t-xl"></div>
      <div class="p-4 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </template>

    <!-- List Skeleton -->
    <template v-else-if="variant === 'list'">
      <div class="flex gap-4 p-4">
        <div class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </template>

    <!-- Text Skeleton -->
    <template v-else-if="variant === 'text'">
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </template>
  </div>
</template>
