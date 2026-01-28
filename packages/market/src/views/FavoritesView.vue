<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { useFavoritesStore } from "@bude/shared";
import { EmptyState, LoadingSkeleton, LazyImage, FavoriteButton } from "@bude/shared/components";
import { formatPrice, timeAgo } from "@bude/shared/utils";
import type { FavoriteItem } from "@bude/shared/api";

const favoritesStore = useFavoritesStore();

const isLoading = ref(true);
const favorites = computed(() => favoritesStore.favorites);
const total = computed(() => favoritesStore.total);

async function loadFavorites() {
  isLoading.value = true;
  await favoritesStore.loadFavorites("Item");
  isLoading.value = false;
}

function getListingUrl(favorite: FavoriteItem): string {
  return `/listing/${favorite.reference_name}`;
}

onMounted(loadFavorites);
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Saved Items</h1>
        <p class="text-gray-500 mt-1">
          {{ total }} item{{ total !== 1 ? 's' : '' }} saved
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <LoadingSkeleton v-for="i in 8" :key="i" variant="card" class="h-64" />
    </div>

    <!-- Favorites Grid -->
    <div
      v-else-if="favorites.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="favorite in favorites"
        :key="favorite.name"
        class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200"
      >
        <RouterLink :to="getListingUrl(favorite)" class="block">
          <!-- Image -->
          <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <LazyImage
              :src="favorite.reference_image || ''"
              :alt="favorite.reference_title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <!-- Content -->
          <div class="p-4">
            <p v-if="favorite.reference_category" class="text-xs text-gray-400 mb-1">
              {{ favorite.reference_category }}
            </p>
            <h3 class="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
              {{ favorite.reference_title }}
            </h3>
            <div class="flex items-end justify-between gap-2">
              <span v-if="favorite.reference_price" class="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {{ formatPrice(favorite.reference_price) }}
              </span>
              <span class="text-xs text-gray-400">
                Saved {{ timeAgo(favorite.creation) }}
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- Remove Button -->
        <div class="absolute top-3 right-3">
          <FavoriteButton
            reference-doctype="Item"
            :reference-name="favorite.reference_name"
            size="sm"
            variant="overlay"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      title="No saved items"
      description="Items you save will appear here. Tap the heart icon on any listing to save it."
      icon="heart"
    >
      <RouterLink
        to="/"
        class="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
      >
        Browse Listings
      </RouterLink>
    </EmptyState>
  </div>
</template>
