<script setup lang="ts">
import { ref, computed } from 'vue';
import { submitReport, REPORT_REASONS } from '../api/report';
import type { ReportReason } from '../api/report';

const props = defineProps<{
  referenceDoctype: string;
  referenceName: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submitted'): void;
}>();

const selectedReason = ref<ReportReason | null>(null);
const details = ref('');
const isSubmitting = ref(false);
const submitted = ref(false);
const error = ref('');

const canSubmit = computed(() => !!selectedReason.value && !isSubmitting.value);

async function handleSubmit() {
  if (!selectedReason.value) return;

  isSubmitting.value = true;
  error.value = '';

  try {
    await submitReport({
      referenceDoctype: props.referenceDoctype,
      referenceName: props.referenceName,
      reason: selectedReason.value,
      details: details.value,
    });
    submitted.value = true;
    emit('submitted');
  } catch (e: any) {
    error.value = e.message || 'Failed to submit report. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function handleClose() {
  emit('update:open', false);
  // Reset state after animation
  setTimeout(() => {
    selectedReason.value = null;
    details.value = '';
    submitted.value = false;
    error.value = '';
  }, 300);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        />

        <!-- Dialog -->
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
          <!-- Success State -->
          <div v-if="submitted" class="p-8 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
            <p class="text-sm text-gray-500 mb-6">
              Thank you for helping keep our platform safe. Our moderation team will review this report.
            </p>
            <button
              @click="handleClose"
              class="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Done
            </button>
          </div>

          <!-- Report Form -->
          <div v-else>
            <!-- Header -->
            <div class="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Report Content</h3>
                <p class="text-sm text-gray-500 mt-0.5">Why are you reporting this?</p>
              </div>
              <button
                @click="handleClose"
                class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Reasons -->
            <div class="p-5 space-y-2 max-h-[50vh] overflow-y-auto">
              <label
                v-for="reason in REPORT_REASONS"
                :key="reason.value"
                class="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                :class="selectedReason === reason.value ? 'bg-primary-50 ring-1 ring-primary-200' : 'hover:bg-gray-50'"
              >
                <input
                  type="radio"
                  :value="reason.value"
                  v-model="selectedReason"
                  class="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ reason.label }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ reason.description }}</p>
                </div>
              </label>

              <!-- Additional Details -->
              <div v-if="selectedReason" class="pt-3">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional details (optional)
                </label>
                <textarea
                  v-model="details"
                  rows="3"
                  placeholder="Provide any extra information that may help our review..."
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>

              <!-- Error -->
              <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
              <button
                @click="handleClose"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="!canSubmit"
                class="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.animate-in {
  animation: dialog-in 0.2s ease-out;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
