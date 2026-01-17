<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { MarketItem } from "@bude/shared/types";

const props = defineProps<{
  item: MarketItem;
}>();

const conditionBadge = computed(() => {
  const badges: Record<string, string> = {
    New: "badge-success",
    "Open Box": "badge-info",
    Refurbished: "badge-warning",
    Used: "bg-gray-100 text-gray-700",
  };
  return badges[props.item.condition] || "badge-info";
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

const formattedPrice = computed(() => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(props.item.standard_rate);
});

const timeAgo = computed(() => {
  const date = new Date(props.item.created);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
});
</script>

<template>
  <RouterLink
    :to="`/listing/${item.item_code}`"
    class="card group cursor-pointer"
  >
    <!-- Image -->
    <div
      class="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100"
    >
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.item_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        <svg
          class="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

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
        <span :class="['badge', conditionBadge]">{{ item.condition }}</span>
      </div>

      <h3
        class="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors"
      >
        {{ item.item_name }}
      </h3>

      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">{{
          formattedPrice
        }}</span>
        <span class="text-xs text-gray-500">{{ timeAgo }}</span>
      </div>
    </div>
  </RouterLink>
</template>
