<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { getSellerInfo, getFeed } from "@bude/shared/api";
import type { MarketItem, SellerInfo } from "@bude/shared/types";
import ItemCard from "../components/ItemCard.vue";

const route = useRoute();
const seller = ref<SellerInfo | null>(null);
const items = ref<MarketItem[]>([]);
const isLoading = ref(true);

async function loadSeller() {
  isLoading.value = true;
  try {
    const userId = route.params.id as string;
    seller.value = await getSellerInfo(userId);

    // Load seller's listings
    const result = await getFeed({
      /* filter by seller */
    });
    items.value = result.data;
  } catch (error) {
    console.error("Failed to load seller:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadSeller);
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Seller Profile -->
    <div v-if="seller" class="card p-6 mb-8">
      <div class="flex items-center gap-4">
        <div
          class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center"
        >
          <span class="text-primary-700 font-bold text-2xl">
            {{ seller.name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {{ seller.name }}
            <span v-if="seller.is_verified" class="badge badge-success"
              >Verified</span
            >
          </h1>
          <p class="text-gray-500">Member since {{ seller.member_since }}</p>
          <p class="text-sm text-gray-600 mt-1">
            {{ seller.listing_count }} listings
          </p>
        </div>
      </div>
    </div>

    <!-- Seller's Listings -->
    <h2 class="text-xl font-bold text-gray-900 mb-4">
      Listings by this Seller
    </h2>

    <div
      v-if="isLoading"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div v-for="i in 4" :key="i" class="card animate-pulse">
        <div class="aspect-square bg-gray-200 rounded-t-xl"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="items.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ItemCard v-for="item in items" :key="item.name" :item="item" />
    </div>

    <div v-else class="text-center py-16 text-gray-500">
      This seller has no active listings
    </div>
  </div>
</template>
