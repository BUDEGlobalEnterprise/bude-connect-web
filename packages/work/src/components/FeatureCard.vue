<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon?: "verified" | "payment" | "network";
  color: "primary" | "accent" | "green";
  emoji?: string;
}>();

const iconPaths = {
  verified:
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  payment:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  network:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
};

const colorClasses = {
  primary: { 
    bg: "bg-gradient-to-br from-primary-500 to-primary-600", 
    text: "text-white",
    shadow: "shadow-primary-500/25",
    ring: "ring-primary-100"
  },
  accent: { 
    bg: "bg-gradient-to-br from-accent-500 to-accent-600", 
    text: "text-white",
    shadow: "shadow-accent-500/25",
    ring: "ring-accent-100"
  },
  green: { 
    bg: "bg-gradient-to-br from-emerald-500 to-emerald-600", 
    text: "text-white",
    shadow: "shadow-emerald-500/25",
    ring: "ring-emerald-100"
  },
};
</script>

<template>
  <div class="group text-center p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
    <!-- Icon Container -->
    <div
      :class="[
        colorClasses[color].bg,
        colorClasses[color].shadow,
        'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300',
      ]"
    >
      <!-- Use emoji if provided, otherwise SVG icon -->
      <span v-if="emoji" class="text-4xl">{{ emoji }}</span>
      <svg
        v-else
        :class="[colorClasses[color].text, 'w-10 h-10']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="iconPaths[icon || 'verified']"
        />
      </svg>
    </div>
    
    <!-- Title -->
    <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
      {{ title }}
    </h3>
    
    <!-- Description -->
    <p class="text-gray-600 leading-relaxed">{{ description }}</p>
  </div>
</template>
