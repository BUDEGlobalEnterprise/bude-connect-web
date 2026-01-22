<template>
  <div ref="containerRef" class="overflow-y-auto" :style="{ height }">
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <div :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="(item, index) in visibleItems"
          :key="startIndex + index"
          :style="{ height: `${itemHeight}px` }"
        >
          <slot :item="item" :index="startIndex + index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  items: T[];
  itemHeight: number;
  height?: string;
  buffer?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  buffer: 3
});

const containerRef = ref<HTMLElement>();
const scrollTop = ref(0);

const totalHeight = computed(() => props.items.length * props.itemHeight);

const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight) - props.buffer;
  return Math.max(0, index);
});

const endIndex = computed(() => {
  if (!containerRef.value) return props.buffer * 2;
  const visibleCount = Math.ceil(containerRef.value.clientHeight / props.itemHeight);
  return Math.min(props.items.length, startIndex.value + visibleCount + props.buffer * 2);
});

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value);
});

const offsetY = computed(() => startIndex.value * props.itemHeight);

const handleScroll = () => {
  if (containerRef.value) {
    scrollTop.value = containerRef.value.scrollTop;
  }
};

onMounted(() => {
  containerRef.value?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll);
});
</script>
