<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  src: string;
  alt?: string;
  placeholder?: string;
  aspectRatio?: string;
}>();

const imageRef = ref<HTMLImageElement>();
const isLoaded = ref(false);
const hasError = ref(false);

const defaultPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";

function onLoad() {
  isLoaded.value = true;
}

function onError() {
  hasError.value = true;
}

onMounted(() => {
  if (!imageRef.value) return;

  // Use Intersection Observer for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = props.src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" },
  );

  observer.observe(imageRef.value);
});
</script>

<template>
  <div
    class="relative overflow-hidden bg-gray-100"
    :style="{ aspectRatio: aspectRatio || '1' }"
  >
    <!-- Blur placeholder -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
      :style="{ animation: 'shimmer 1.5s infinite' }"
    />

    <!-- Actual image -->
    <img
      ref="imageRef"
      :src="placeholder || defaultPlaceholder"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-300"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onLoad"
      @error="onError"
    />

    <!-- Error state -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100"
    >
      <svg
        class="w-12 h-12 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
