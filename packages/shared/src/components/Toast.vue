<script setup lang="ts">
import { ref, reactive, readonly, computed, onMounted } from "vue";
import Icon from './Icon.vue';

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: number;
}

const props = defineProps<{
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}>();

const toasts = reactive<Toast[]>([]);
const toastTimers = new Map<number, { interval: NodeJS.Timeout; timeout: NodeJS.Timeout }>();
let nextId = 0;

const positionClasses = computed(() => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  return positions[props.position || 'top-right'];
});

function addToast(options: Omit<Toast, "id" | "progress">) {
  const id = nextId++;
  const toast: Toast = { id, progress: 100, ...options };
  toasts.push(toast);

  // Progress bar animation
  const startTime = Date.now();
  const interval = setInterval(() => {
    const toastIndex = toasts.findIndex(t => t.id === id);
    if (toastIndex > -1) {
      const elapsed = Date.now() - startTime;
      toasts[toastIndex].progress = Math.max(0, 100 - (elapsed / options.duration) * 100);
    }
  }, 50);

  const timeout = setTimeout(() => {
    removeToast(id);
  }, options.duration);

  toastTimers.set(id, { interval, timeout });

  return id;
}

function removeToast(id: number) {
  const timers = toastTimers.get(id);
  if (timers) {
    clearInterval(timers.interval);
    clearTimeout(timers.timeout);
    toastTimers.delete(id);
  }

  const index = toasts.findIndex((t) => t.id === id);
  if (index > -1) toasts.splice(index, 1);
}

function pauseToast(id: number) {
  const timers = toastTimers.get(id);
  if (timers) {
    clearInterval(timers.interval);
    clearTimeout(timers.timeout);
  }
}

function resumeToast(id: number, remainingTime: number) {
  const toast = toasts.find(t => t.id === id);
  if (!toast) return;

  const startTime = Date.now();
  const startProgress = toast.progress || 0;

  const interval = setInterval(() => {
    const toastIndex = toasts.findIndex(t => t.id === id);
    if (toastIndex > -1) {
      const elapsed = Date.now() - startTime;
      toasts[toastIndex].progress = Math.max(0, startProgress - (elapsed / remainingTime) * startProgress);
    }
  }, 50);

  const timeout = setTimeout(() => {
    removeToast(id);
  }, remainingTime);

  toastTimers.set(id, { interval, timeout });
}

// Export for use in composable
defineExpose({ addToast, removeToast, toasts: readonly(toasts) });

const iconMap = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert-circle',
  info: 'info',
};

const styleConfig = {
  success: {
    bg: 'bg-success-50 dark:bg-success-950',
    border: 'border-success-200 dark:border-success-800',
    icon: 'text-success-600 dark:text-success-400',
    title: 'text-success-900 dark:text-success-100',
    message: 'text-success-700 dark:text-success-300',
    progress: 'bg-success-500',
  },
  error: {
    bg: 'bg-destructive-50 dark:bg-destructive-950',
    border: 'border-destructive-200 dark:border-destructive-800',
    icon: 'text-destructive-600 dark:text-destructive-400',
    title: 'text-destructive-900 dark:text-destructive-100',
    message: 'text-destructive-700 dark:text-destructive-300',
    progress: 'bg-destructive-500',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-950',
    border: 'border-warning-200 dark:border-warning-800',
    icon: 'text-warning-600 dark:text-warning-400',
    title: 'text-warning-900 dark:text-warning-100',
    message: 'text-warning-700 dark:text-warning-300',
    progress: 'bg-warning-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    message: 'text-blue-700 dark:text-blue-300',
    progress: 'bg-blue-500',
  },
};
</script>

<template>
  <Teleport to="body">
    <div :class="['fixed z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none', positionClasses]">
      <TransitionGroup
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
        move-class="duration-200"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-md pointer-events-auto',
            'transform transition-all duration-200',
            styleConfig[toast.type].bg,
            styleConfig[toast.type].border,
          ]"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id, (toast.progress || 0) / 100 * toast.duration)"
        >
          <!-- Progress bar -->
          <div class="absolute bottom-0 left-0 h-1 w-full bg-black/5">
            <div
              :class="['h-full transition-all duration-100 ease-linear', styleConfig[toast.type].progress]"
              :style="{ width: `${toast.progress}%` }"
            />
          </div>

          <div class="flex gap-3 p-4">
            <!-- Icon -->
            <div :class="['flex-shrink-0 mt-0.5', styleConfig[toast.type].icon]">
              <Icon :name="iconMap[toast.type]" size="sm" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p :class="['font-semibold text-sm', styleConfig[toast.type].title]">
                {{ toast.title }}
              </p>
              <p
                v-if="toast.message"
                :class="['text-sm mt-1 leading-relaxed', styleConfig[toast.type].message]"
              >
                {{ toast.message }}
              </p>

              <!-- Action button -->
              <button
                v-if="toast.action"
                @click="toast.action.onClick(); removeToast(toast.id)"
                :class="['mt-2 text-sm font-medium underline-offset-4 hover:underline', styleConfig[toast.type].icon]"
              >
                {{ toast.action.label }}
              </button>
            </div>

            <!-- Close button -->
            <button
              @click="removeToast(toast.id)"
              :class="[
                'flex-shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity',
                'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                styleConfig[toast.type].icon,
              ]"
            >
              <Icon name="x" size="xs" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
