<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPortal,
  ComboboxContent,
  ComboboxViewport,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxAnchor
} from 'radix-vue';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { cn } from '../../../lib/utils';

interface Option {
  label: string;
  value: string;
}

const props = withDefaults(defineProps<{
  modelValue?: string | number;
  options?: (string | Option)[];
  placeholder?: string;
  emptyText?: string;
  minSearchLength?: number;
  disabled?: boolean;
  allowOther?: boolean;
  class?: string;
}>(), {
  options: () => [],
  placeholder: 'Select an option...',
  emptyText: 'No results found.',
  minSearchLength: 0,
  allowOther: false
});

const emit = defineEmits(['update:modelValue', 'update:searchTerm']);

// Normalize options to objects
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') return { label: opt, value: opt };
    return opt;
  });
});

const searchTerm = ref('');
const isOpen = ref(false);

const filteredOptions = computed(() => {
  const term = searchTerm.value.toLowerCase();
  
  // Create base list from normalized options
  let filtered = normalizedOptions.value;

  // 1. Min Length Logic:
  if (props.minSearchLength > 0 && term.length < props.minSearchLength) {
     return []; 
  }

  // 2. Search Logic:
  if (term) {
    filtered = filtered.filter(opt => opt.label.toLowerCase().includes(term));
  }

  // 3. "Other" Option Logic:
  if (props.allowOther) {
     const hasOther = filtered.some(o => o.value === 'Other');
     if (!hasOther) {
       filtered = [...filtered, { label: 'Other', value: 'Other' }];
     }
  }

  return filtered;
});

const displayValue = (v: any) => {
  if (!v) return '';
  const found = normalizedOptions.value.find(o => o.value === v);
  return found ? found.label : String(v);
};

// Update local search on open
watch(isOpen, (val) => {
  if (!val) searchTerm.value = '';
});

// Disable Radix filtering since we handle it manually
const filterFunction = (list: any[]) => list;

</script>

<template>
  <ComboboxRoot
    :model-value="props.modelValue"
    v-model:searchTerm="searchTerm"
    v-model:open="isOpen"
    :disabled="disabled"
    :display-value="displayValue"
    :filter-function="filterFunction"
    :class="cn('relative', props.class)"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <ComboboxAnchor class="relative flex items-center w-full">
      <ComboboxInput
        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8"
        :placeholder="placeholder"
      />
      <ComboboxTrigger class="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground hover:text-foreground">
        <ChevronsUpDown class="h-4 w-4 opacity-50" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        class="z-[100] min-w-[200px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <ComboboxViewport class="p-1 max-h-[300px]">
          <div v-if="minSearchLength > 0 && searchTerm.length < minSearchLength" class="py-6 text-center text-sm text-muted-foreground">
            Type at least {{ minSearchLength }} characters...
          </div>
          
          <div v-else-if="filteredOptions.length === 0" class="py-6 text-center text-sm text-muted-foreground">
            {{ emptyText }}
          </div>

          <template v-else>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="option.value"
              :value="option.value"
              class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
            >
              <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <ComboboxItemIndicator>
                  <Check class="h-4 w-4" />
                </ComboboxItemIndicator>
              </span>
              <span>{{ option.label }}</span>
            </ComboboxItem>
          </template>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
