<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getFeed, getCategories } from "@bude/shared/api";
import type { MarketItem } from "@bude/shared/types";
import { LoadingSkeleton, EmptyState } from "@bude/shared/components";
import ItemCard from "../components/ItemCard.vue";
import CategoryNav from "../components/CategoryNav.vue";
import HeroBanner from "../components/HeroBanner.vue";

const items = ref<MarketItem[]>([]);
const categories = ref<{ name: string; count: number }[]>([]);
const isLoading = ref(true);
const selectedCategory = ref<string | null>(null);
const selectedListingType = ref<string | null>(null);

const listingTypes = [
  { value: "Sell", label: "Buy", icon: "🛒" },
  { value: "Rent", label: "Rent", icon: "🔄" },
  { value: "Surplus", label: "Surplus", icon: "📦" },
  { value: "Scrap", label: "Scrap", icon: "♻️" },
];

const filteredItems = computed(() => items.value);

async function loadFeed() {
  isLoading.value = true;
  try {
    const result = await getFeed({
      category: selectedCategory.value || undefined,
      listing_type: (selectedListingType.value as any) || undefined,
    });
    items.value = result.data;
  } catch (error) {
    console.error("Failed to load feed:", error);
  } finally {
    isLoading.value = false;
  }
}

async function loadCategories() {
  try {
    categories.value = await getCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

function selectCategory(category: string | null) {
  selectedCategory.value = category;
  loadFeed();
}

function selectListingType(type: string | null) {
  selectedListingType.value = type;
  loadFeed();
}

onMounted(() => {
  loadCategories();
  loadFeed();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Banner -->
    <HeroBanner
      title="Buy, Sell & Rent"
      subtitle="Find the best deals on goods across India"
      :filters="listingTypes"
      :selectedFilter="selectedListingType"
      @selectFilter="selectListingType"
    />

    <!-- Categories -->
    <CategoryNav
      :categories="categories"
      :selected="selectedCategory"
      @select="selectCategory"
    />

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
    >
      <div v-for="i in 8" :key="i" class="card">
        <LoadingSkeleton variant="card" />
      </div>
    </div>

    <!-- Items Grid -->
    <div
      v-else-if="filteredItems.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
    >
      <ItemCard v-for="item in filteredItems" :key="item.name" :item="item" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="inbox"
      title="No listings found"
      message="Try adjusting your filters or check back later"
    />
  </div>
</template>
