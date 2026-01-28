<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  threshold?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 80,
  disabled: false,
});

const emit = defineEmits<{
  refresh: [];
}>();

const container = ref<HTMLElement | null>(null);
const isRefreshing = ref(false);
const pullDistance = ref(0);
const isPulling = ref(false);

let startY = 0;
let currentY = 0;

function onTouchStart(e: TouchEvent) {
  if (props.disabled || isRefreshing.value) return;

  // Only enable pull-to-refresh when at top of scroll
  const scrollTop = container.value?.scrollTop ?? document.documentElement.scrollTop;
  if (scrollTop > 5) return;

  startY = e.touches[0].clientY;
  isPulling.value = true;
}

function onTouchMove(e: TouchEvent) {
  if (!isPulling.value || props.disabled || isRefreshing.value) return;

  currentY = e.touches[0].clientY;
  const delta = currentY - startY;

  // Only pull down, not up
  if (delta > 0) {
    // Apply resistance curve
    pullDistance.value = Math.min(delta * 0.5, props.threshold * 1.5);

    // Prevent default scroll when pulling
    if (pullDistance.value > 10) {
      e.preventDefault();
    }
  }
}

function onTouchEnd() {
  if (!isPulling.value || props.disabled) return;

  isPulling.value = false;

  if (pullDistance.value >= props.threshold && !isRefreshing.value) {
    isRefreshing.value = true;
    emit('refresh');
  } else {
    pullDistance.value = 0;
  }
}

function finishRefresh() {
  isRefreshing.value = false;
  pullDistance.value = 0;
}

// Expose method to parent
defineExpose({ finishRefresh });

onMounted(() => {
  const el = container.value;
  if (!el) return;

  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: false });
  el.addEventListener('touchend', onTouchEnd, { passive: true });
});

onUnmounted(() => {
  const el = container.value;
  if (!el) return;

  el.removeEventListener('touchstart', onTouchStart);
  el.removeEventListener('touchmove', onTouchMove);
  el.removeEventListener('touchend', onTouchEnd);
});
</script>

<template>
  <div ref="container" class="pull-to-refresh-container relative">
    <!-- Pull indicator -->
    <div
      class="absolute left-0 right-0 flex items-center justify-center transition-all duration-200 overflow-hidden"
      :style="{
        height: `${pullDistance}px`,
        top: 0,
        transform: `translateY(-${Math.max(0, props.threshold - pullDistance)}px)`,
      }"
    >
      <div class="flex flex-col items-center gap-2 py-4">
        <!-- Spinner or arrow -->
        <div
          class="w-8 h-8 flex items-center justify-center"
          :class="isRefreshing ? 'animate-spin' : ''"
        >
          <svg
            v-if="isRefreshing"
            class="w-6 h-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-gray-500 transition-transform duration-200"
            :style="{ transform: `rotate(${Math.min(180, (pullDistance / props.threshold) * 180)}deg)` }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <span class="text-sm text-gray-500">
          {{ isRefreshing ? 'Refreshing...' : pullDistance >= props.threshold ? 'Release to refresh' : 'Pull to refresh' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div
      class="transition-transform duration-200"
      :style="{ transform: `translateY(${pullDistance}px)` }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pull-to-refresh-container {
  touch-action: pan-y;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
