<script setup lang="ts">
import { computed } from 'vue';
import type { TaxonomyAttribute } from '../types/taxonomy';
import { Input, Textarea, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Checkbox } from './ui';
import { TagInput } from './';

interface Props {
  attribute: TaxonomyAttribute;
  modelValue: any;
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// Infer input type from attribute metadata
const inputType = computed((): string => {
  if (props.attribute.input_type) {
    return props.attribute.input_type;
  }

  // Auto-detect based on name/handle
  const handle = props.attribute.handle.toLowerCase();
  const name = props.attribute.name.toLowerCase();

  if (handle.includes('color') || name.includes('color')) return 'color';
  if (handle.includes('description') || name.includes('description')) return 'textarea';
  if (handle.includes('size') || handle.includes('weight') || handle.includes('length')) return 'number';
  if (props.attribute.values && props.attribute.values.length > 0) return 'select';

  return 'text';
});

const placeholder = computed(() => {
  return `Enter ${props.attribute.name.toLowerCase()}`;
});
</script>

<template>
  <div class="dynamic-attribute-input space-y-2">
    <!-- Label -->
    <label class="block text-sm font-medium text-gray-700">
      {{ attribute.name }}
      <span v-if="attribute.required" class="text-red-500">*</span>
      <span v-if="attribute.description" class="block text-xs font-normal text-gray-500 mt-1">
        {{ attribute.description }}
      </span>
    </label>

    <!-- Text Input -->
    <Input
      v-if="inputType === 'text'"
      v-model="value"
      :placeholder="placeholder"
      :class="{ 'border-red-500': error }"
    />

    <!-- Textarea -->
    <Textarea
      v-else-if="inputType === 'textarea'"
      v-model="value"
      :placeholder="placeholder"
      rows="3"
      :class="{ 'border-red-500': error }"
    />

    <!-- Select Dropdown -->
    <Select v-else-if="inputType === 'select' && attribute.values" v-model="value">
      <SelectTrigger :class="{ 'border-red-500': error }">
        <SelectValue :placeholder="`Select ${attribute.name}`" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Select {{ attribute.name }}</SelectItem>
        <SelectItem v-for="option in attribute.values" :key="option" :value="option">
          {{ option }}
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Multi-Select (Tags) -->
    <TagInput
      v-else-if="inputType === 'multi-select'"
      v-model="value"
      :placeholder="`Add ${attribute.name.toLowerCase()}`"
      :class="{ 'border-red-500': error }"
    />

    <!-- Number Input -->
    <Input
      v-else-if="inputType === 'number'"
      v-model.number="value"
      type="number"
      :placeholder="placeholder"
      :class="{ 'border-red-500': error }"
    />

    <!-- Color Picker -->
    <div v-else-if="inputType === 'color'" class="flex gap-2">
      <input
        v-model="value"
        type="color"
        class="h-10 w-16 rounded border cursor-pointer"
        :class="{ 'border-red-500': error }"
      />
      <Input
        v-model="value"
        :placeholder="placeholder"
        class="flex-1"
        :class="{ 'border-red-500': error }"
      />
    </div>

    <!-- Boolean Checkbox -->
    <div v-else-if="inputType === 'boolean'" class="flex items-center gap-2">
      <Checkbox
        :checked="!!value"
        @update:checked="value = $event"
        :id="`attr-${attribute.handle}`"
      />
      <label :for="`attr-${attribute.handle}`" class="text-sm cursor-pointer">
        {{ attribute.name }}
      </label>
    </div>

    <!-- Fallback: Text Input -->
    <Input
      v-else
      v-model="value"
      :placeholder="placeholder"
      :class="{ 'border-red-500': error }"
    />

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>

    <!-- Extended Attribute Badge -->
    <span v-if="attribute.extended" class="inline-flex items-center text-xs text-gray-500">
      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      Extended attribute
    </span>
  </div>
</template>

<style scoped>
.dynamic-attribute-input {
  @apply mb-4;
}
</style>
