<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getMyListings, markAsSold } from "@bude/shared/api";
import { formatPrice } from "@bude/shared/utils";
import {
  Button,
  Badge,
  EmptyState,
  LoadingSkeleton,
  LazyImage,
} from "@bude/shared/components";
import type { MarketItem } from "@bude/shared/types";

const items = ref<MarketItem[]>([]);
const isLoading = ref(true);
const activeTab = ref<"active" | "sold" | "expired">("active");

async function loadListings() {
  isLoading.value = true;
  try {
    const statusMap = { active: "Published", sold: "Sold", expired: "Expired" };
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

function switchTab(tab: "active" | "sold" | "expired") {
  activeTab.value = tab;
  loadListings();
}

onMounted(loadListings);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Ads</h1>
      <RouterLink to="/post">
        <Button>+ Post New Ad</Button>
      </RouterLink>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <Button
        v-for="tab in ['active', 'sold', 'expired'] as const"
        :key="tab"
        :variant="activeTab === tab ? 'primary' : 'secondary'"
        @click="switchTab(tab)"
        class="capitalize"
      >
        {{ tab }}
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <LoadingSkeleton variant="list" v-for="i in 3" :key="i" />
    </div>

    <!-- Listings -->
    <div v-else-if="items.length > 0" class="space-y-4">
      <div v-for="item in items" :key="item.name" class="card p-4 flex gap-4">
        <RouterLink :to="`/listing/${item.item_code}`" class="flex-shrink-0">
          <div class="w-24 h-24 rounded-lg overflow-hidden">
            <LazyImage
              :src="item.image || ''"
              :alt="item.item_name"
              aspect-ratio="1"
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
            <Badge variant="info">{{ item.listing_type }}</Badge>
            <Badge>{{ item.condition }}</Badge>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <RouterLink :to="`/listing/${item.item_code}`">
            <Button variant="secondary" size="sm">View</Button>
          </RouterLink>
          <Button
            v-if="item.listing_status === 'Published'"
            variant="outline"
            size="sm"
            @click="handleMarkSold(item.item_code)"
          >
            Mark Sold
          </Button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState
      v-else
      :title="`No ${activeTab} ads`"
      :message="
        activeTab === 'active'
          ? 'Start selling by posting your first ad'
          : `You don't have any ${activeTab} ads yet`
      "
      icon="inbox"
    >
      <template #action>
        <RouterLink v-if="activeTab === 'active'" to="/post">
          <Button class="mt-4">Post Your First Ad</Button>
        </RouterLink>
      </template>
    </EmptyState>
  </div>
</template>
