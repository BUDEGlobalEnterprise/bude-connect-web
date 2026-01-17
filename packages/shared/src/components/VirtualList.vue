<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  items: unknown[];
  itemHeight: number;
  containerHeight?: number;
  buffer?: number;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const containerRef = ref<HTMLElement>();
const scrollTop = ref(0);

const bufferSize = computed(() => props.buffer || 5);
const visibleCount = computed(() => {
  const height = props.containerHeight || 600;
  return Math.ceil(height / props.itemHeight) + bufferSize.value * 2;
});

const startIndex = computed(() => {
  return Math.max(
    0,
    Math.floor(scrollTop.value / props.itemHeight) - bufferSize.value,
  );
});

const endIndex = computed(() => {
  return Math.min(props.items.length, startIndex.value + visibleCount.value);
});

const visibleItems = computed(() => {
  return props.items
    .slice(startIndex.value, endIndex.value)
    .map((item, index) => ({
      item,
      index: startIndex.value + index,
    }));
});

const totalHeight = computed(() => props.items.length * props.itemHeight);
const offsetY = computed(() => startIndex.value * props.itemHeight);

function handleScroll(e: Event) {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;

  // Trigger load more when near bottom
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 200) {
    emit("loadMore");
  }
}

onMounted(() => {
  containerRef.value?.addEventListener("scroll", handleScroll, {
    passive: true,
  });
});

onUnmounted(() => {
  containerRef.value?.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div
    ref="containerRef"
    class="overflow-auto"
    :style="{ height: `${containerHeight || 600}px` }"
  >
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <div :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="{ item, index } in visibleItems"
          :key="index"
          :style="{ height: `${itemHeight}px` }"
        >
          <slot :item="item" :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>
