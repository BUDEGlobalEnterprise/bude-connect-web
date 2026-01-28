<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  mode?: 'fade' | 'slide' | 'slide-up' | 'scale';
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'fade',
  duration: 200,
});

const transitionName = computed(() => `page-${props.mode}`);
</script>

<template>
  <Transition
    :name="transitionName"
    mode="out-in"
    appear
  >
    <slot />
  </Transition>
</template>

<style>
/* Fade */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Slide (horizontal) */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.25s ease-out;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Slide Up */
.page-slide-up-enter-active,
.page-slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.page-slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scale */
.page-scale-enter-active,
.page-scale-leave-active {
  transition: all 0.2s ease;
}

.page-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.page-scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
