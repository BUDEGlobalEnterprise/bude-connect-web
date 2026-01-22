<template>
  <div
    :class="[
      'bg-background',
      side === 'right' ? 'ml-auto' : 'mr-auto'
    ]"
  >
    <!-- Overlay -->
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/50"
      @click="$emit('update:open', false)"
    />
    
    <!-- Panel -->
    <div
      :class="[
        'fixed top-0 z-50 h-full w-80 bg-background shadow-lg transition-transform duration-300',
        side === 'right' ? 'right-0' : 'left-0',
        open
          ? 'translate-x-0'
          : side === 'right'
          ? 'translate-x-full'
          : '-translate-x-full'
      ]"
    >
      <div class="flex h-full flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-4">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <Button variant="ghost" size="icon" @click="$emit('update:open', false)">
            <X class="h-4 w-4" />
          </Button>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <slot />
        </div>
        
        <!-- Footer -->
        <div v-if="$slots.footer" class="border-t p-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from './ui/button';
import { X } from 'lucide-vue-next';

interface Props {
  open?: boolean;
  title?: string;
  side?: 'left' | 'right';
}

withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Panel',
  side: 'right'
});

defineEmits<{
  'update:open': [value: boolean];
}>();
</script>
