<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  verified?: boolean;
  bordered?: boolean;
  fallbackIcon?: boolean;
}>();

const sizeConfig = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-1.5 h-1.5', verified: 'w-3 h-3' },
  sm: { container: 'w-8 h-8', text: 'text-sm', status: 'w-2 h-2', verified: 'w-4 h-4' },
  md: { container: 'w-10 h-10', text: 'text-base', status: 'w-2.5 h-2.5', verified: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', text: 'text-lg', status: 'w-3 h-3', verified: 'w-6 h-6' },
  xl: { container: 'w-16 h-16', text: 'text-xl', status: 'w-3.5 h-3.5', verified: 'w-7 h-7' },
  '2xl': { container: 'w-24 h-24', text: 'text-3xl', status: 'w-4 h-4', verified: 'w-8 h-8' },
};

const statusColors = {
  online: 'bg-success',
  offline: 'bg-gray-400',
  away: 'bg-warning',
  busy: 'bg-destructive',
};

const currentSize = computed(() => sizeConfig[props.size || 'md']);

const initials = computed(() => {
  if (!props.name) return '?';
  const parts = props.name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || '?';
});

const gradientClass = computed(() => {
  // Generate consistent gradient based on name
  const gradients = [
    'from-primary-500 to-primary-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
  ];
  if (!props.name) return gradients[0];
  const index = props.name.charCodeAt(0) % gradients.length;
  return gradients[index];
});
</script>

<template>
  <div class="relative inline-flex flex-shrink-0">
    <!-- Avatar Container -->
    <div
      :class="[
        currentSize.container,
        shape === 'square' ? 'rounded-xl' : 'rounded-full',
        'overflow-hidden transition-all duration-200',
        bordered && 'ring-2 ring-white shadow-sm',
      ]"
    >
      <!-- Image -->
      <img
        v-if="src"
        :src="src"
        :alt="name || 'Avatar'"
        class="w-full h-full object-cover"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />

      <!-- Fallback with Initials -->
      <div
        v-else
        :class="[
          'w-full h-full flex items-center justify-center font-semibold text-white bg-gradient-to-br',
          gradientClass,
          currentSize.text,
        ]"
      >
        <template v-if="fallbackIcon">
          <svg class="w-1/2 h-1/2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </template>
        <template v-else>
          {{ initials }}
        </template>
      </div>
    </div>

    <!-- Status Indicator -->
    <span
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
        currentSize.status,
        statusColors[status],
      ]"
    />

    <!-- Verified Badge -->
    <div
      v-if="verified"
      :class="[
        'absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5 shadow-sm',
      ]"
    >
      <div :class="['rounded-full bg-primary flex items-center justify-center', currentSize.verified]">
        <svg
          class="w-3/5 h-3/5 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
