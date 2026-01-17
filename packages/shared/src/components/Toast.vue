<script setup lang="ts">
import { ref, reactive, readonly } from "vue";

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration: number;
}

const toasts = reactive<Toast[]>([]);
let nextId = 0;

function addToast(options: Omit<Toast, "id">) {
  const id = nextId++;
  const toast: Toast = { id, ...options };
  toasts.push(toast);

  setTimeout(() => {
    removeToast(id);
  }, options.duration);
}

function removeToast(id: number) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index > -1) toasts.splice(index, 1);
}

// Export for use in composable
defineExpose({ addToast, removeToast, toasts: readonly(toasts) });

const iconPaths = {
  success:
    "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  error:
    "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
  warning:
    "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
  info: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
      <TransitionGroup
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
            bgColors[toast.type],
          ]"
        >
          <svg
            :class="['w-5 h-5 flex-shrink-0', iconColors[toast.type]]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              :d="iconPaths[toast.type]"
              fill-rule="evenodd"
              clip-rule="evenodd"
            />
          </svg>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-sm text-gray-600">
              {{ toast.message }}
            </p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
