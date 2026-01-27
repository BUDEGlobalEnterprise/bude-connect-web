<script setup lang="ts">
import { computed } from "vue";

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

const props = defineProps<{
  categories: CategoryItem[];
  selected: string | null;
}>();

const emit = defineEmits<{
  select: [categoryId: string | null];
}>();

const totalCount = computed(() =>
  props.categories.reduce((sum, c) => sum + c.count, 0)
);
</script>

<template>
  <div class="relative">
    <!-- Gradient fade indicators -->
    <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

    <!-- Scrollable container -->
    <div class="flex gap-3 overflow-x-auto pb-3 px-2 scrollbar-hide scroll-smooth">
      <!-- All button -->
      <button
        @click="emit('select', null)"
        :class="[
          'group flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 border-2',
          !selected
            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25 scale-105'
            : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50',
        ]"
      >
        <span class="text-lg transition-transform group-hover:scale-110">🏠</span>
        <span>All</span>
        <span
          :class="[
            'text-xs px-1.5 py-0.5 rounded-full transition-colors',
            !selected
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600',
          ]"
        >
          {{ totalCount }}
        </span>
      </button>

      <!-- Category buttons -->
      <button
        v-for="category in categories"
        :key="category.id"
        @click="emit('select', category.id)"
        :class="[
          'group flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 border-2',
          selected === category.id
            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25 scale-105'
            : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50',
        ]"
      >
        <!-- Icon -->
        <span class="text-lg transition-transform group-hover:scale-110">
          {{ category.icon || '📦' }}
        </span>

        <!-- Name -->
        <span>{{ category.name }}</span>

        <!-- Count badge -->
        <span
          :class="[
            'text-xs px-1.5 py-0.5 rounded-full transition-colors',
            selected === category.id
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600',
          ]"
        >
          {{ category.count }}
        </span>
      </button>
    </div>
  </div>
</template>
