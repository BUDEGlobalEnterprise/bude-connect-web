<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { MarketItem } from "@bude/shared/types";
import { formatPrice, timeAgo } from "@bude/shared/utils";
import { LazyImage, Badge } from "@bude/shared/components";

const props = defineProps<{
  item: MarketItem;
}>();

const conditionVariant = computed(() => {
  const variants: Record<string, "success" | "info" | "warning" | "default"> = {
    New: "success",
    "Open Box": "info",
    Refurbished: "warning",
    Used: "default",
  };
  return variants[props.item.condition] || "default";
});

const listingTypeBadge = computed(() => {
  const types: Record<string, { class: string; label: string }> = {
    Sell: { class: "bg-green-500", label: "For Sale" },
    Rent: { class: "bg-blue-500", label: "For Rent" },
    Surplus: { class: "bg-orange-500", label: "Surplus" },
    Scrap: { class: "bg-gray-500", label: "Scrap" },
  };
  return types[props.item.listing_type] || types["Sell"];
});
</script>

<template>
  <RouterLink
    :to="`/listing/${item.item_code}`"
    class="card group cursor-pointer"
  >
    <!-- Image -->
    <div class="relative overflow-hidden rounded-t-xl">
      <LazyImage
        :src="item.image || ''"
        :alt="item.item_name"
        aspect-ratio="1"
        class="group-hover:scale-105 transition-transform duration-300"
      />

      <!-- Type badge -->
      <div class="absolute top-2 left-2">
        <span
          :class="[
            listingTypeBadge.class,
            'text-white text-xs font-medium px-2 py-1 rounded-full',
          ]"
        >
          {{ listingTypeBadge.label }}
        </span>
      </div>

      <!-- Distance badge (if available) -->
      <div v-if="item.distance_km" class="absolute top-2 right-2">
        <span class="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {{ item.distance_km.toFixed(1) }} km
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex items-center gap-2 mb-1">
        <Badge :variant="conditionVariant">{{ item.condition }}</Badge>
      </div>

      <h3
        class="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors"
      >
        {{ item.item_name }}
      </h3>

      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">
          {{ formatPrice(item.standard_rate) }}
        </span>
        <span class="text-xs text-gray-500">{{ timeAgo(item.created) }}</span>
      </div>
    </div>
  </RouterLink>
</template>
