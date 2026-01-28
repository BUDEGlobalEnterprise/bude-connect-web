<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../../lib/utils';

const props = defineProps<{
  class?: string;
  defaultValue?: string | number;
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  autocomplete?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val ?? ''),
});
</script>

<template>
  <input
    v-model="modelValue"
    :type="type || 'text'"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :id="id"
    :name="name"
    :autocomplete="autocomplete"
    :class="cn(
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-slate-400/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  />
</template>
