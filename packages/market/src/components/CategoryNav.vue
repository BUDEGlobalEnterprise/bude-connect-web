<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  categories: { name: string; count: number; image?: string }[];
  selected: string | null;
}>();

const emit = defineEmits<{
  select: [category: string | null];
}>();

// Category icons mapping
const categoryIcons: Record<string, string> = {
  "All": "🏠",
  "Electronics": "📱",
  "Furniture": "🪑",
  "Vehicles": "🚗",
  "Fashion": "👕",
  "Real Estate": "🏢",
  "Services": "🔧",
  "Books": "📚",
  "Sports": "⚽",
  "Home & Garden": "🏡",
  "Industrial": "🏭",
};

const allCategories = computed(() => [
  { name: "All", count: props.categories.reduce((sum, c) => sum + c.count, 0) },
  ...props.categories,
]);

function getCategoryIcon(name: string): string {
  return categoryIcons[name] || "📦";
}
</script>

<template>
  <div class="relative">
    <!-- Gradient fade indicators -->
    <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    
    <!-- Scrollable container -->
    <div class="flex gap-3 overflow-x-auto pb-3 px-2 scrollbar-hide scroll-smooth">
      <button
        v-for="category in allCategories"
        :key="category.name"
        @click="emit('select', category.name === 'All' ? null : category.name)"
        :class="[
          'group flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 border-2',
          (category.name === 'All' && !selected) || selected === category.name
            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25 scale-105'
            : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50',
        ]"
      >
        <!-- Icon -->
        <span class="text-lg transition-transform group-hover:scale-110">
          {{ getCategoryIcon(category.name) }}
        </span>
        
        <!-- Name -->
        <span>{{ category.name }}</span>
        
        <!-- Count badge -->
        <span
          :class="[
            'text-xs px-1.5 py-0.5 rounded-full transition-colors',
            (category.name === 'All' && !selected) || selected === category.name
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
