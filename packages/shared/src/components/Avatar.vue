<script setup lang="ts">
defineProps<{
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  verified?: boolean;
  imageUrl?: string;
}>();

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-3xl",
};
</script>

<template>
  <div class="relative inline-block">
    <div
      v-if="imageUrl"
      :class="[sizeClasses[size || 'md'], 'rounded-full overflow-hidden']"
    >
      <img :src="imageUrl" :alt="name" class="w-full h-full object-cover" />
    </div>
    <div
      v-else
      :class="[
        sizeClasses[size || 'md'],
        'rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700',
      ]"
    >
      {{ name.charAt(0).toUpperCase() }}
    </div>

    <!-- Verified Badge -->
    <div
      v-if="verified"
      :class="[
        'absolute -bottom-1 -right-1 bg-primary-500 rounded-full flex items-center justify-center',
        size === 'sm' ? 'w-4 h-4' : size === 'xl' ? 'w-8 h-8' : 'w-6 h-6',
      ]"
    >
      <svg
        class="w-3/4 h-3/4 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>
