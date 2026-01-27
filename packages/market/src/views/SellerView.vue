<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getSellerInfo, getFeed } from "@bude/shared/api";
import {
  Avatar,
  Badge,
  EmptyState,
  LoadingSkeleton,
  ReviewSection,
} from "@bude/shared/components";
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
        <Avatar :name="seller.name" size="xl" :verified="seller.isVerified" />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {{ seller.name }}
            <Badge v-if="seller.isVerified" variant="success">Verified</Badge>
          </h1>
          <p class="text-gray-500">Member since {{ seller.memberSince }}</p>
          <p class="text-sm text-gray-600 mt-1">
            {{ seller.listingCount }} listings
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
      <div v-for="i in 4" :key="i" class="card">
        <LoadingSkeleton variant="default" />
      </div>
    </div>

    <div
      v-else-if="items.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ItemCard v-for="item in items" :key="item.name" :item="item" />
    </div>

    <EmptyState
      v-else
      title="No active listings"
      message="This seller has no active listings"
      icon="inbox"
    />

    <!-- Reviews -->
    <div v-if="seller" class="mt-10">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
      <ReviewSection :user-id="(route.params.id as string)" />
    </div>
  </div>
</template>
