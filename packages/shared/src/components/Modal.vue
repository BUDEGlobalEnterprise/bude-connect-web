<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import Icon from './Icon.vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  centered?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "close": [];
}>();

const modalRef = ref<HTMLElement>();
const isAnimating = ref(false);

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

const canClose = computed(() => props.closable !== false);
const canCloseOnClickOutside = computed(() => props.closeOnClickOutside !== false && canClose.value);
const canCloseOnEscape = computed(() => props.closeOnEscape !== false && canClose.value);
const shouldShowClose = computed(() => props.showClose !== false && canClose.value);

function close() {
  if (!canClose.value) return;
  emit("update:modelValue", false);
  emit("close");
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue && canCloseOnEscape.value) {
    close();
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (canCloseOnClickOutside.value && e.target === e.currentTarget) {
    close();
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      isAnimating.value = true;
      setTimeout(() => isAnimating.value = false, 200);
    } else {
      document.body.style.overflow = "";
    }
  },
);

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Modal Container -->
        <div
          :class="[
            'flex min-h-full p-4',
            centered !== false ? 'items-center justify-center' : 'items-start justify-center pt-16',
          ]"
        >
          <!-- Modal Panel -->
          <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="modelValue"
              ref="modalRef"
              :class="[
                'relative w-full bg-card rounded-xl shadow-2xl border border-gray-200/50',
                'transform transition-all',
                sizeClasses[size || 'md'],
              ]"
              @click.stop
            >
              <!-- Header -->
              <div
                v-if="title || description || $slots.header || shouldShowClose"
                class="flex items-start justify-between gap-4 p-6 border-b border-gray-100"
              >
                <div class="flex-1 min-w-0">
                  <slot name="header">
                    <h2 v-if="title" class="text-lg font-semibold text-foreground">
                      {{ title }}
                    </h2>
                    <p v-if="description" class="mt-1 text-sm text-muted-foreground">
                      {{ description }}
                    </p>
                  </slot>
                </div>
                <button
                  v-if="shouldShowClose"
                  @click="close"
                  class="flex-shrink-0 p-2 -m-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <Icon name="x" size="sm" />
                </button>
              </div>

              <!-- Body -->
              <div class="p-6">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl"
              >
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
