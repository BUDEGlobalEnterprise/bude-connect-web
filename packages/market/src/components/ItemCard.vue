<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { MarketItem } from "@bude/shared/types";
import { formatPrice, timeAgo } from "@bude/shared/utils";
import { LazyImage, Badge, FavoriteButton } from "@bude/shared/components";

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
    class="group block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 hover:-translate-y-1 transform-gpu"
  >
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <LazyImage
        :src="item.image || ''"
        :alt="item.itemName"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <!-- Type Badge (Top Left) -->
      <div class="absolute top-3 left-3 transform group-hover:scale-105 transition-transform duration-300">
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
      <div v-if="item.distanceKm" class="absolute top-3 right-3 flex items-center gap-2">
        <span class="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg group-hover:bg-black/80 transition-colors">
          📍 {{ item.distanceKm.toFixed(1) }} km
        </span>
      </div>

      <!-- Favorite Button (Top Right, shown on hover) -->
      <div
        v-if="!item.distanceKm"
        class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
      >
        <FavoriteButton
          reference-doctype="Item"
          :reference-name="item.name || item.itemCode"
          size="sm"
          variant="overlay"
        />
      </div>

      <!-- Quick View Hint (Bottom, on hover) -->
      <div class="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span class="block text-center text-white text-xs font-medium">
          Click to view details →
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Condition Badge -->
      <div class="flex items-center gap-2 mb-2">
        <Badge :variant="conditionConfig.variant" size="sm" class="group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-primary-200 transition-all duration-200">
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
        <div class="group-hover:scale-105 transition-transform duration-200 origin-left">
          <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {{ displayPrice }}
          </span>
          <span v-if="item.listingType === 'Rent'" class="text-xs text-gray-500 ml-1">/day</span>
        </div>
        <span class="text-xs text-gray-400 whitespace-nowrap group-hover:text-gray-600 transition-colors">
          {{ timeAgo(item.createdAt || item.creation) }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
