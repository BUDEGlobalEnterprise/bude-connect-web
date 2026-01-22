<template>
  <div class="relative">
    <Input
      v-model="query"
      type="text"
      :placeholder="placeholder"
      class="pr-20"
      @input="handleInput"
      @focus="showResults = true"
    />
    
    <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
      <kbd class="px-1.5 py-0.5 text-xs bg-muted border rounded">⌘K</kbd>
    </div>
    
    <div
      v-if="showResults && results.length > 0"
      class="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg max-h-96 overflow-y-auto"
    >
      <div
        v-for="(result, index) in results"
        :key="index"
        :class="[
          'flex items-center gap-3 p-3 cursor-pointer transition-colors',
          index === selectedIndex ? 'bg-accent' : 'hover:bg-muted'
        ]"
        @click="selectResult(result)"
        @mouseenter="selectedIndex = index"
      >
        <component v-if="result.icon" :is="result.icon" class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm">{{ result.title }}</div>
          <div v-if="result.description" class="text-xs text-muted-foreground truncate">
            {{ result.description }}
          </div>
        </div>
        
        <Badge v-if="result.badge" variant="secondary" class="text-xs">
          {{ result.badge }}
        </Badge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { Component } from 'vue';

export interface SearchResult {
  title: string;
  description?: string;
  icon?: Component;
  badge?: string;
  data?: any;
}

interface Props {
  placeholder?: string;
  onSearch?: (query: string) => SearchResult[] | Promise<SearchResult[]>;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
});

const emit = defineEmits<{
  select: [result: SearchResult];
}>();

const query = ref('');
const results = ref<SearchResult[]>([]);
const showResults = ref(false);
const selectedIndex = ref(0);

const handleInput = async () => {
  if (!props.onSearch || query.value.length < 2) {
    results.value = [];
    return;
  }
  
  const searchResults = await props.onSearch(query.value);
  results.value = Array.isArray(searchResults) ? searchResults : [];
  selectedIndex.value = 0;
};

const selectResult = (result: SearchResult) => {
  emit('select', result);
  query.value = result.title;
  showResults.value = false;
};

watch(() => query.value, (newVal) => {
  if (!newVal) {
    showResults.value = false;
  }
});
</script>
