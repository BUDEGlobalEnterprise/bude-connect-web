<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getFeed, getCategories } from "@bude/shared/api";
import type { MarketItem } from "@bude/shared/types";
import ItemCard from "../components/ItemCard.vue";
import CategoryNav from "../components/CategoryNav.vue";

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
    <div
      class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 mb-8"
    >
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative z-10 px-8 py-12 text-white">
        <h1 class="text-4xl font-bold mb-2">Buy, Sell & Rent</h1>
        <p class="text-lg text-white/90 mb-6">
          Find the best deals on goods across India
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in listingTypes"
            :key="type.value"
            @click="
              selectListingType(
                selectedListingType === type.value ? null : type.value,
              )
            "
            :class="[
              'px-4 py-2 rounded-full font-medium transition-all',
              selectedListingType === type.value
                ? 'bg-white text-primary-600'
                : 'bg-white/20 text-white hover:bg-white/30',
            ]"
          >
            {{ type.icon }} {{ type.label }}
          </button>
        </div>
      </div>
    </div>

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
      <div v-for="i in 8" :key="i" class="card animate-pulse">
        <div class="aspect-square bg-gray-200 rounded-t-xl"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">No listings found</h3>
      <p class="text-gray-500">
        Try adjusting your filters or check back later
      </p>
    </div>
  </div>
</template>
