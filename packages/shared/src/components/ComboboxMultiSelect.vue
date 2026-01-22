<template>
  <div class="relative">
    <Button
      variant="outline"
      role="combobox"
      class="w-full justify-between"
      @click="open = !open"
    >
      <span v-if="selectedItems.length === 0" class="text-muted-foreground">
        {{ placeholder }}
      </span>
      <div v-else class="flex gap-1 flex-wrap">
        <Badge v-for="item in selectedItems.slice(0, 3)" :key="item.value" variant="secondary" class="mr-1">
          {{ item.label }}
        </Badge>
        <Badge v-if="selectedItems.length > 3" variant="secondary">
          +{{ selectedItems.length - 3 }} more
        </Badge>
      </div>
      <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
    
    <div
      v-if="open"
      class="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg"
      @click.stop
    >      
      <div class="p-2 border-b">
        <Input
          v-model="searchQuery"
          placeholder="Search..."
          class="h-9"
        />
      </div>
      
      <div class="max-h-72 overflow-y-auto">
        <div class="p-2">
          <div
            v-for="item in filteredOptions"
            :key="item.value"
            class="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent"
            @click="toggleItem(item)"
          >
            <div
              class="w-4 h-4 border rounded flex items-center justify-center"
              :class="isSelected(item) ? 'bg-primary border-primary' : 'border-input'"
            >
              <Check v-if="isSelected(item)" class="h-3 w-3 text-primary-foreground" />
            </div>
            <span>{{ item.label }}</span>
          </div>
          
          <div v-if="filteredOptions.length === 0" class="p-4 text-center text-sm text-muted-foreground">
            No results found.
          </div>
        </div>
      </div>
      
      <div v-if="selectedItems.length > 0" class="p-2 border-t flex justify-between items-center">
        <span class="text-xs text-muted-foreground">
          {{ selectedItems.length }} selected
        </span>
        <Button variant="ghost" size="sm" @click="clearAll">
          Clear all
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Check, ChevronDown } from 'lucide-vue-next';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface Props {
  options: ComboboxOption[];
  modelValue?: string[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Select items...'
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const open = ref(false);
const searchQuery = ref('');
const selectedValues = ref<string[]>([...props.modelValue]);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  );
});

const selectedItems = computed(() =>
  props.options.filter(option => selectedValues.value.includes(option.value))
);

const isSelected = (item: ComboboxOption) =>
  selectedValues.value.includes(item.value);

const toggleItem = (item: ComboboxOption) => {
  const index = selectedValues.value.indexOf(item.value);
  
  if (index > -1) {
    selectedValues.value.splice(index, 1);
  } else {
    selectedValues.value.push(item.value);
  }
  
  emit('update:modelValue', selectedValues.value);
};

const clearAll = () => {
  selectedValues.value = [];
  emit('update:modelValue', []);
};
</script>
