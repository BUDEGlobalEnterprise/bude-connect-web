<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getMyListings, markAsSold } from "@bude/shared/api";
import type { MarketItem } from "@bude/shared/types";

const items = ref<MarketItem[]>([]);
const isLoading = ref(true);
const activeTab = ref<"active" | "sold" | "expired">("active");

async function loadListings() {
  isLoading.value = true;
  try {
    const statusMap = {
      active: "Published",
      sold: "Sold",
      expired: "Expired",
    };
    const result = await getMyListings({ status: statusMap[activeTab.value] });
    items.value = result.data;
  } catch (error) {
    console.error("Failed to load listings:", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleMarkSold(itemCode: string) {
  try {
    await markAsSold(itemCode);
    loadListings();
  } catch (error) {
    console.error("Failed to mark as sold:", error);
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

onMounted(loadListings);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Ads</h1>
      <RouterLink to="/post" class="btn btn-primary">
        + Post New Ad
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in ['active', 'sold', 'expired'] as const"
        :key="tab"
        @click="
          activeTab = tab;
          loadListings();
        "
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all capitalize',
          activeTab === tab
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-4 animate-pulse flex gap-4">
        <div class="w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Listings -->
    <div v-else-if="items.length > 0" class="space-y-4">
      <div v-for="item in items" :key="item.name" class="card p-4 flex gap-4">
        <RouterLink :to="`/listing/${item.item_code}`" class="flex-shrink-0">
          <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.item_name"
              class="w-full h-full object-cover"
            />
          </div>
        </RouterLink>

        <div class="flex-1 min-w-0">
          <RouterLink :to="`/listing/${item.item_code}`">
            <h3
              class="font-medium text-gray-900 truncate hover:text-primary-600"
            >
              {{ item.item_name }}
            </h3>
          </RouterLink>
          <p class="text-lg font-bold text-primary-600">
            {{ formatPrice(item.standard_rate) }}
          </p>
          <div class="flex gap-2 mt-2">
            <span class="badge badge-info">{{ item.listing_type }}</span>
            <span class="badge bg-gray-100 text-gray-700">{{
              item.condition
            }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <RouterLink
            :to="`/listing/${item.item_code}`"
            class="btn btn-secondary text-sm"
          >
            View
          </RouterLink>
          <button
            v-if="item.listing_status === 'Published'"
            @click="handleMarkSold(item.item_code)"
            class="btn btn-outline text-sm"
          >
            Mark Sold
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <div
        class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">
        No {{ activeTab }} ads
      </h3>
      <p class="text-gray-500 mb-4">
        <template v-if="activeTab === 'active'"
          >Start selling by posting your first ad</template
        >
        <template v-else>You don't have any {{ activeTab }} ads yet</template>
      </p>
      <RouterLink
        v-if="activeTab === 'active'"
        to="/post"
        class="btn btn-primary"
      >
        Post Your First Ad
      </RouterLink>
    </div>
  </div>
</template>
