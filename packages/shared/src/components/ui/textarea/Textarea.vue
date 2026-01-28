<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../../lib/utils';

const props = defineProps<{
  class?: string;
  defaultValue?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  rows?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val ?? ''),
});
</script>

<template>
  <textarea
    v-model="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :id="id"
    :name="name"
    :rows="rows || 3"
    :class="cn(
      'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  />
</template>
