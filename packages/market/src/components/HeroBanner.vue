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
    class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 mb-8"
  >
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="relative z-10 px-8 py-12 text-white">
      <h1 class="text-4xl font-bold mb-2">{{ title }}</h1>
      <p v-if="subtitle" class="text-lg text-white/90 mb-6">{{ subtitle }}</p>

      <div v-if="filters?.length" class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="
            handleFilterClick(
              selectedFilter === filter.value ? '' : filter.value,
            )
          "
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all',
            selectedFilter === filter.value
              ? 'bg-white text-primary-600'
              : 'bg-white/20 text-white hover:bg-white/30',
          ]"
        >
          <span v-if="filter.icon">{{ filter.icon }}</span>
          {{ filter.label }}
        </button>
      </div>

      <slot />
    </div>
  </div>
</template>
