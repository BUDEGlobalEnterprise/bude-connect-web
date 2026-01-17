<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  categories: { name: string; count: number }[];
  selected: string | null;
}>();

const emit = defineEmits<{
  select: [category: string | null];
}>();

const allCategories = computed(() => [
  { name: "All", count: props.categories.reduce((sum, c) => sum + c.count, 0) },
  ...props.categories,
]);
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="category in allCategories"
      :key="category.name"
      @click="emit('select', category.name === 'All' ? null : category.name)"
      :class="[
        'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all',
        (category.name === 'All' && !selected) || selected === category.name
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
    >
      {{ category.name }}
      <span class="ml-1 text-xs opacity-70">({{ category.count }})</span>
    </button>
  </div>
</template>
