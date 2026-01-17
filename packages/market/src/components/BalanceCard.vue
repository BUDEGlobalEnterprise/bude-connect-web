<script setup lang="ts">
defineProps<{ balance: number }>();
</script>

<template>
  <div
    class="card p-6 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 text-white"
  >
    <p class="text-sm text-white/80 mb-1">Available Balance</p>
    <p class="text-4xl font-bold">{{ balance }} Credits</p>
    <p class="text-sm text-white/70 mt-2">1 credit = 1 contact unlock</p>
  </div>
</template>
