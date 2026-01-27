<script setup lang="ts">
import { useRoute } from 'vue-router';
const props = defineProps<{
  items: {
    name?: string;
    label?: string;
    path?: string;
    to?: string;
    icon: string;
    activeIcon?: string;
  }[];
}>();

const route = useRoute();

const isActive = (target: string) => {
  if (target === '/') return route.path === '/';
  return route.path.startsWith(target);
};
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe">
    <div class="flex items-center justify-around h-16 px-2">
      <router-link
        v-for="item in items"
        :key="item.path || item.to"
        :to="item.path || item.to || '/'"
        class="flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300"
        :class="isActive(item.path || item.to || '/') ? 'text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600'"
      >
        <span class="text-xl leading-none">
          {{ isActive(item.path || item.to || '/') ? (item.activeIcon || item.icon) : item.icon }}
        </span>
        <span class="text-[10px] font-bold uppercase tracking-wider">
          {{ item.name || item.label }}
        </span>
        
        <!-- Indicator Dot -->
        <div 
          v-if="isActive(item.path || item.to || '/')"
          class="w-1 h-1 rounded-full bg-primary-600 absolute -bottom-1"
        ></div>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
