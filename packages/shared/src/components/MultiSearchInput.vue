<template>
  <div class="relative">
    <div
      class="flex flex-wrap items-center gap-1.5 min-h-[36px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring"
      @click="focusInput"
    >
      <Badge
        v-for="(item, index) in modelValue"
        :key="index"
        variant="secondary"
        class="gap-1 pr-1"
      >
        {{ getItemLabel(item) }}
        <span
          role="button"
          class="rounded-full hover:bg-destructive/20 p-0.5 cursor-pointer"
          @click.stop="removeItem(index)"
        >
          <X class="h-3 w-3" />
        </span>
      </Badge>

      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        class="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground ml-1"
        @input="handleInput"
        @focus="showResults = true"
        @keydown.backspace="handleBackspace"
        @keydown.enter.prevent="handleEnter"
      />
    </div>

    <!-- Results Dropdown -->
    <div
      v-if="showResults && (results.length > 0 || (query && allowCustom))"
      class="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <!-- Custom Add Option -->
      <div
        v-if="allowCustom && query && !exactMatch"
        class="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted text-primary"
        @click="addCustomItem"
      >
        <Plus class="h-4 w-4" />
        <span class="font-medium">Add "{{ query }}"</span>
      </div>

      <div
        v-for="(result, index) in results"
        :key="index"
        class="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted transition-colors"
        @click="selectResult(result)"
      >
        <component v-if="result.icon" :is="result.icon" class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm">{{ result.title }}</div>
          <div v-if="result.description" class="text-xs text-muted-foreground truncate">
            {{ result.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface SearchResult {
  title: string;
  description?: string;
  icon?: Component;
  data?: any;
}

interface Props {
  modelValue: any[];
  placeholder?: string;
  allowCustom?: boolean;
  onSearch?: (query: string) => SearchResult[] | Promise<SearchResult[]>;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Search...',
  allowCustom: false
});

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
  'search': [query: string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const query = ref('');
const results = ref<SearchResult[]>([]);
const showResults = ref(false);

const getItemLabel = (item: any) => {
  if (typeof item === 'string') return item;
  return item.name || item.title || item.label || JSON.stringify(item);
};

const exactMatch = ref(false);

const handleInput = async () => {
  if (!props.onSearch) {
    results.value = [];
    return;
  }
  
  if (query.value.length < 1) {
    results.value = [];
    return;
  }
  
  const searchResults = await props.onSearch(query.value);
  
  // Filter out already selected items
  const selectedLabels = props.modelValue.map(i => getItemLabel(i).toLowerCase());
  
  results.value = searchResults.filter(r => !selectedLabels.includes(r.title.toLowerCase()));

  // Check for exact match in selected items OR filtered results
  const queryLower = query.value.toLowerCase();
  exactMatch.value = results.value.some(r => r.title.toLowerCase() === queryLower) ||
                     selectedLabels.includes(queryLower);
};

const selectResult = (result: SearchResult) => {
  const resultLabel = result.title.toLowerCase();
  const selectedLabels = props.modelValue.map(i => getItemLabel(i).toLowerCase());
  
  if (selectedLabels.includes(resultLabel)) {
    query.value = '';
    showResults.value = false;
    return;
  }

  emit('update:modelValue', [...props.modelValue, result.data || result.title]);
  query.value = '';
  results.value = [];
  showResults.value = false;
  focusInput();
};

const addCustomItem = () => {
  if (!query.value) return;
  
  const queryLower = query.value.toLowerCase();
  const selectedLabels = props.modelValue.map(i => getItemLabel(i).toLowerCase());
  
  if (selectedLabels.includes(queryLower)) {
    query.value = ''; // Clear duplicate input
    return;
  }

  // If expecting objects, we might need a prop to define how to create one.
  // For now assuming string or simple object structure if customizable.
  // But props.modelValue is any[].
  // If the parent passes search results with data objects, maybe we assume string for custom?
  emit('update:modelValue', [...props.modelValue, query.value]);
  query.value = '';
  results.value = [];
  showResults.value = false;
  focusInput();
};

const removeItem = (index: number) => {
  const newDetails = [...props.modelValue];
  newDetails.splice(index, 1);
  emit('update:modelValue', newDetails);
};

const handleBackspace = () => {
  if (!query.value && props.modelValue.length > 0) {
    removeItem(props.modelValue.length - 1);
  }
};

const handleEnter = () => {
  if (props.allowCustom && query.value) {
    addCustomItem();
  } else if (results.value.length > 0) {
    selectResult(results.value[0]);
  }
};

const focusInput = () => {
  inputRef.value?.focus();
};

// Close dropdown on click outside - basic implementation
// In a real app we might use useOnClickOutside or similar
watch(() => showResults.value, (val) => {
  if (val) {
    // maybe bind global click listener
  }
});

</script>
