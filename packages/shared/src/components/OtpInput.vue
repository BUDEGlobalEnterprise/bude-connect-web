<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  length?: number;
  modelValue?: string;
  autofocus?: boolean;
}>(), {
  length: 6,
  modelValue: '',
  autofocus: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'complete', value: string): void;
}>();

const digits = ref<string[]>(Array(props.length).fill(''));
const inputRefs = ref<(HTMLInputElement | null)[]>([]);

function setRef(el: any, index: number) {
  inputRefs.value[index] = el as HTMLInputElement;
}

function getCombined(): string {
  return digits.value.join('');
}

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Only allow single digit
  if (value.length > 1) {
    digits.value[index] = value.slice(-1);
  } else {
    digits.value[index] = value;
  }

  // Only allow numbers
  if (digits.value[index] && !/^\d$/.test(digits.value[index])) {
    digits.value[index] = '';
    return;
  }

  const combined = getCombined();
  emit('update:modelValue', combined);

  // Auto-advance to next input
  if (digits.value[index] && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus();
    });
  }

  // Auto-submit when all digits filled
  if (combined.length === props.length) {
    emit('complete', combined);
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      // Move to previous input on backspace when current is empty
      event.preventDefault();
      digits.value[index - 1] = '';
      emit('update:modelValue', getCombined());
      nextTick(() => {
        inputRefs.value[index - 1]?.focus();
      });
    } else {
      digits.value[index] = '';
      emit('update:modelValue', getCombined());
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    inputRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault();
    inputRefs.value[index + 1]?.focus();
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text')?.trim() || '';
  const numbers = pasted.replace(/\D/g, '').slice(0, props.length);

  if (!numbers) return;

  for (let i = 0; i < props.length; i++) {
    digits.value[i] = numbers[i] || '';
  }

  const combined = getCombined();
  emit('update:modelValue', combined);

  // Focus the next empty input, or the last one
  const nextEmpty = digits.value.findIndex((d) => !d);
  const focusIndex = nextEmpty === -1 ? props.length - 1 : nextEmpty;
  nextTick(() => {
    inputRefs.value[focusIndex]?.focus();
  });

  if (combined.length === props.length) {
    emit('complete', combined);
  }
}

function handleFocus(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}

// Sync external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== getCombined()) {
    for (let i = 0; i < props.length; i++) {
      digits.value[i] = newVal?.[i] || '';
    }
  }
});

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      inputRefs.value[0]?.focus();
    });
  }
});
</script>

<template>
  <div class="flex items-center justify-center gap-2 sm:gap-3">
    <template v-for="(_, index) in length" :key="index">
      <!-- Separator after 3rd digit -->
      <div
        v-if="index === 3"
        class="w-3 flex items-center justify-center text-gray-300"
      >
        <div class="w-2 h-0.5 bg-gray-300 rounded-full" />
      </div>

      <input
        :ref="(el) => setRef(el, index)"
        :value="digits[index]"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="1"
        class="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-150 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        :class="digits[index] ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200 bg-white'"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
        @focus="handleFocus"
      />
    </template>
  </div>
</template>
