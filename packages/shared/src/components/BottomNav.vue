<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();

interface NavItem {
  to: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const props = defineProps<{
  items: NavItem[];
}>();

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/');
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
    <div class="flex items-center justify-around h-16">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors"
        :class="isActive(item.to) ? 'text-primary-600' : 'text-gray-500'"
      >
        <span class="text-xl mb-0.5">{{ isActive(item.to) ? item.activeIcon : item.icon }}</span>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
