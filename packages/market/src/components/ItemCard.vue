<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { MarketItem } from "@bude/shared/types";
import { formatPrice, timeAgo } from "@bude/shared/utils";
import { LazyImage, Badge } from "@bude/shared/components";

const props = defineProps<{
  item: MarketItem;
}>();

const conditionConfig = computed(() => {
  const config: Record<string, { variant: "success" | "secondary" | "warning" | "default"; icon: string }> = {
    New: { variant: "success", icon: "✨" },
    "Like New": { variant: "secondary", icon: "👌" },
    "Good": { variant: "secondary", icon: "👍" },
    "Fair": { variant: "warning", icon: "📦" },
    "Open Box": { variant: "secondary", icon: "📭" },
    Refurbished: { variant: "warning", icon: "🔧" },
    Used: { variant: "default", icon: "🔄" },
  };
  return config[props.item.condition] || { variant: "default", icon: "📦" };
});

const listingTypeConfig = computed(() => {
  const config: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    Sell: { bg: "bg-emerald-500", text: "text-emerald-50", label: "For Sale", icon: "🛒" },
    Rent: { bg: "bg-blue-500", text: "text-blue-50", label: "For Rent", icon: "🔄" },
    Surplus: { bg: "bg-amber-500", text: "text-amber-50", label: "Surplus", icon: "📦" },
    Scrap: { bg: "bg-slate-500", text: "text-slate-50", label: "Scrap", icon: "♻️" },
  };
  return config[props.item.listingType] || config["Sell"];
});

// Format price with compact notation for large values
const displayPrice = computed(() => {
  const price = props.item.standardRate || 0;
  return formatPrice(price);
});
</script>

<template>
  <RouterLink
    :to="`/listing/${item.name || item.itemCode}`"
    class="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200"
  >
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <LazyImage
        :src="item.image || ''"
        :alt="item.itemName"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <!-- Type Badge (Top Left) -->
      <div class="absolute top-3 left-3">
        <span
          :class="[
            listingTypeConfig.bg,
            listingTypeConfig.text,
            'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm',
          ]"
        >
          <span>{{ listingTypeConfig.icon }}</span>
          {{ listingTypeConfig.label }}
        </span>
      </div>

      <!-- Distance Badge (Top Right) -->
      <div v-if="item.distanceKm" class="absolute top-3 right-3">
        <span class="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
          📍 {{ item.distanceKm.toFixed(1) }} km
        </span>
      </div>

      <!-- Wishlist Button (Top Right, shown on hover) -->
      <button
        v-if="!item.distanceKm"
        class="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-md"
        @click.prevent.stop
      >
        <svg class="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Condition Badge -->
      <div class="flex items-center gap-2 mb-2">
        <Badge :variant="conditionConfig.variant" size="sm">
          <span class="mr-1">{{ conditionConfig.icon }}</span>
          {{ item.condition }}
        </Badge>
      </div>

      <!-- Title -->
      <h3
        class="font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors duration-200 min-h-[2.5rem]"
      >
        {{ item.itemName }}
      </h3>

      <!-- Price & Time Row -->
      <div class="flex items-end justify-between gap-2">
        <div>
          <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {{ displayPrice }}
          </span>
          <span v-if="item.listingType === 'Rent'" class="text-xs text-gray-500 ml-1">/day</span>
        </div>
        <span class="text-xs text-gray-400 whitespace-nowrap">
          {{ timeAgo(item.createdAt || item.creation) }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
