<template>
  <button
    v-if="show"
    :class="[
      'fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg transition-all',
      'bg-primary text-primary-foreground hover:bg-primary/90',
      'opacity-0 animate-fade-in'
    ]"
    @click="scrollToTop"
  >
    <ChevronUp class="h-5 w-5" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronUp } from 'lucide-vue-next';

interface Props {
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 300
});

const show = ref(false);

const handleScroll = () => {
  show.value = window.scrollY > props.threshold;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out forwards;
}
</style>
