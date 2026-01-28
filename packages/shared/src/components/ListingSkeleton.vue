<script setup lang="ts">
// Listing Skeleton Component
// Provides smooth loading state for marketplace and talent feeds
</script>

<template>
  <div class="listing-skeleton bg-white/70 backdrop-blur-md border border-white/30 rounded-xl shadow-sm p-4 animate-pulse">
    <!-- Image Skeleton -->
    <div class="aspect-video bg-gray-200 rounded-lg mb-4"></div>
    
    <!-- Title Skeleton -->
    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    
    <!-- Subtitle Skeleton -->
    <div class="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
    
    <!-- Meta Skeleton -->
    <div class="flex items-center justify-between">
      <div class="h-5 bg-gray-200 rounded w-1/4"></div>
      <div class="h-8 bg-gray-100 rounded-full w-24"></div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped glass effect for build stability */
.listing-skeleton {
  background: var(--glass-bg, rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(var(--glass-blur, 12px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 12px));
}
</style>
