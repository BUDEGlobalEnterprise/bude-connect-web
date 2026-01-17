<script setup lang="ts">
import { ref } from "vue";
import { LazyImage } from "@bude/shared/components";

const props = defineProps<{
  images: (string | undefined)[];
  alt: string;
}>();

const activeIndex = ref(0);
const validImages = props.images.filter(Boolean) as string[];
</script>

<template>
  <div>
    <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
      <LazyImage
        v-if="validImages[activeIndex]"
        :src="validImages[activeIndex]"
        :alt="alt"
        aspect-ratio="1"
      />
    </div>

    <!-- Thumbnails -->
    <div v-if="validImages.length > 1" class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="(img, index) in validImages"
        :key="index"
        @click="activeIndex = index"
        :class="[
          'w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
          activeIndex === index ? 'border-primary-500' : 'border-transparent',
        ]"
      >
        <img :src="img" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>
