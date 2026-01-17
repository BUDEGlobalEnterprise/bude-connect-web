<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string | number;
  type?: "text" | "email" | "tel" | "number" | "password" | "search";
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      v-model="inputValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none',
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
          : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        disabled && 'bg-gray-100 cursor-not-allowed',
      ]"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
