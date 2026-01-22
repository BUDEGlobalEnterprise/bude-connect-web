<template>
  <div class="relative inline-block">
    <Button
      variant="outline"
      size="icon"
      @click="toggleShare"
    >
      <Share2 class="h-4 w-4" />
    </Button>
    
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50 p-2"
      @click.stop
    >
      <div class="space-y-1">
        <button
          v-if="canUseNativeShare"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent"
          @click="shareNative"
        >
          <Share2 class="h-4 w-4" />
          <span>Share</span>
        </button>
        
        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent"
          @click="copyLink"
        >
          <Check v-if="copied" class="h-4 w-4 text-green-600" />
          <Link v-else class="h-4 w-4" />
          <span>{{ copied ? 'Copied!' : 'Copy link' }}</span>
        </button>
        
        <a
          v-for="platform in platforms"
          :key="platform.name"
          :href="platform.url"
          target="_blank"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent"
        >
          <component :is="platform.icon" class="h-4 w-4" />
          <span>{{ platform.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from './ui/button';
import { Share2, Link, Check } from 'lucide-vue-next';

interface Props {
  url: string;
  title?: string;
  text?: string;
}

const props = defineProps<Props>();

const isOpen = ref(false);
const copied = ref(false);

const canUseNativeShare = computed(() => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
});

const platforms = computed(() => [
  {
    name: 'Twitter',
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title || '')}`,
    icon: Share2
  },
  {
    name: 'LinkedIn',
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`,
    icon: Share2
  },
  {
    name: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
    icon: Share2
  }
]);

const toggleShare = () => {
  isOpen.value = !isOpen.value;
};

const shareNative = async () => {
  try {
    await navigator.share({
      title: props.title,
      text: props.text,
      url: props.url
    });
    isOpen.value = false;
  } catch (err) {
    console.error('Share failed:', err);
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
      isOpen.value = false;
    }, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
};
</script>
