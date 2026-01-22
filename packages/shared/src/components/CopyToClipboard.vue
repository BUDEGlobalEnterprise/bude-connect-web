<template>
  <button
    :class="[
      'group relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
      'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
    ]"
    @click="copyToClipboard"
  >
    <span class="select-all">{{ text }}</span>
    
    <span class="flex-shrink-0">
      <Check v-if="copied" class="h-4 w-4 text-green-600" />
      <Copy v-else class="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
    </span>
    
    <!-- Tooltip -->
    <span
      v-if="showTooltip && copied"
      class="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded pointer-events-none"
    >
      Copied!
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check } from 'lucide-vue-next';

interface Props {
  text: string;
  showTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true
});

const emit = defineEmits<{
  copied: [text: string];
}>();

const copied = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    emit('copied', props.text);
    
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
