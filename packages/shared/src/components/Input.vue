<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  modelValue: string | number;
  type?: "text" | "email" | "tel" | "number" | "password" | "search" | "url";
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: string;
  prefix?: string;
  suffix?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  "focus": [];
  "blur": [];
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isFocused = ref(false);
const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text';
  return props.type || 'text';
});

function handleFocus() {
  isFocused.value = true;
  emit('focus');
}

function handleBlur() {
  isFocused.value = false;
  emit('blur');
}
</script>

<template>
  <div class="space-y-1.5">
    <!-- Label -->
    <label v-if="label" class="text-sm font-medium text-gray-700 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>

    <!-- Input Wrapper -->
    <div
      :class="[
        'flex items-center w-full rounded-md border bg-background transition-all duration-200',
        isFocused && !error && 'ring-2 ring-ring ring-offset-1 border-primary',
        error ? 'border-destructive ring-2 ring-destructive/20' : 'border-input',
        disabled && 'opacity-50 cursor-not-allowed bg-muted',
      ]"
    >
      <!-- Prefix -->
      <span v-if="prefix" class="pl-3 text-muted-foreground text-sm select-none">
        {{ prefix }}
      </span>

      <!-- Icon -->
      <span v-if="icon" class="pl-3 text-muted-foreground">
        {{ icon }}
      </span>

      <!-- Input -->
      <input
        v-model="inputValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="handleFocus"
        @blur="handleBlur"
        class="flex-1 h-10 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />

      <!-- Password Toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="pr-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg v-if="showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      <!-- Suffix -->
      <span v-if="suffix" class="pr-3 text-muted-foreground text-sm select-none">
        {{ suffix }}
      </span>
    </div>

    <!-- Hint / Error Message -->
    <p v-if="error" class="text-sm text-destructive flex items-center gap-1">
      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-sm text-muted-foreground">{{ hint }}</p>
  </div>
</template>
