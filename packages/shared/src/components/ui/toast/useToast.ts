import { ref, computed, type Component } from 'vue';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: Component;
  variant?: ToastVariant;
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = genId();
  const newToast = { id, ...toast };

  toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT);

  const duration = toast.duration ?? TOAST_REMOVE_DELAY;
  setTimeout(() => {
    dismissToast(id);
  }, duration);

  return id;
}

function dismissToast(toastId: string) {
  toasts.value = toasts.value.filter((t) => t.id !== toastId);
}

function dismissAllToasts() {
  toasts.value = [];
}

export function useToast() {
  return {
    toasts: computed(() => toasts.value),
    toast: addToast,
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
  };
}

export { addToast as toast };
