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
  ReportDialog,
} from "@bude/shared/components";
import type { MarketItem, SellerInfo } from "@bude/shared/types";
import ItemCard from "../components/ItemCard.vue";

const route = useRoute();
const seller = ref<SellerInfo | null>(null);
const items = ref<MarketItem[]>([]);
const isLoading = ref(true);
const showReportDialog = ref(false);

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
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {{ seller.name }}
            <Badge v-if="seller.isVerified" variant="success">Verified</Badge>
          </h1>
          <p class="text-gray-500">Member since {{ seller.memberSince }}</p>
          <p class="text-sm text-gray-600 mt-1">
            {{ seller.listingCount }} listings
          </p>
        </div>
        <button
          @click="showReportDialog = true"
          class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Report seller"
        >
          <svg class="w-4.5 h-4.5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </button>
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

    <!-- Report Dialog -->
    <ReportDialog
      v-if="seller"
      :open="showReportDialog"
      :reference-doctype="'User'"
      :reference-name="seller.userId"
      @update:open="showReportDialog = $event"
    />
  </div>
</template>
