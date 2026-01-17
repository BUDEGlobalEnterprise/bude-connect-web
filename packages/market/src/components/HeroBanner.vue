<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  filters?: { value: string; label: string; icon?: string }[];
  selectedFilter?: string | null;
}>();

const emit = defineEmits<{
  selectFilter: [value: string | null];
}>();

function handleFilterClick(value: string) {
  emit("selectFilter", value === undefined ? null : value);
}
</script>

<template>
  <div
    class="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500"
  >
    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Animated gradient orbs -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22/></svg>');" />
    </div>

    <!-- Content -->
    <div class="relative z-10 px-8 py-14 md:py-16 text-white">
      <div class="max-w-2xl">
        <!-- Title with gradient effect -->
        <h1 class="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          {{ title }}
        </h1>
        
        <!-- Subtitle -->
        <p v-if="subtitle" class="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
          {{ subtitle }}
        </p>

        <!-- Filter Pills -->
        <div v-if="filters?.length" class="flex flex-wrap gap-3">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="handleFilterClick(selectedFilter === filter.value ? '' : filter.value)"
            :class="[
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg',
              selectedFilter === filter.value
                ? 'bg-white text-primary-600 scale-105 shadow-white/25'
                : 'bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:scale-105',
            ]"
          >
            <span v-if="filter.icon" class="text-lg">{{ filter.icon }}</span>
            {{ filter.label }}
          </button>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>
