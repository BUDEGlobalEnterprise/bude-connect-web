<template>
  <nav aria-label="Breadcrumb" class="flex items-center space-x-1 text-sm text-muted-foreground">
    <a
      v-for="(item, index) in items"
      :key="index"
      :href="item.href"
      :class="[
        'flex items-center gap-1 transition-colors',
        index === items.length - 1
          ? 'text-foreground font-medium'
          : 'hover:text-foreground'
      ]"
      @click.prevent="handleClick(item, index)"
    >
      <component v-if="item.icon && index === 0" :is="item.icon" class="h-4 w-4" />
      <span>{{ item.label }}</span>
      <ChevronRight v-if="index < items.length - 1" class="h-4 w-4" />
    </a>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: Component;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  navigate: [item: BreadcrumbItem, index: number];
}>();

const handleClick = (item: BreadcrumbItem, index: number) => {
  emit('navigate', item, index);
};
</script>
