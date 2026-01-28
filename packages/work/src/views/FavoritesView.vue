<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { useFavoritesStore } from "@bude/shared";
import { EmptyState, LoadingSkeleton, Avatar, Badge, FavoriteButton } from "@bude/shared/components";
import { formatPrice, timeAgo } from "@bude/shared/utils";
import type { FavoriteItem } from "@bude/shared/api";

const favoritesStore = useFavoritesStore();

type TabType = "Job Opening" | "Supplier";
const activeTab = ref<TabType>("Job Opening");
const isLoading = ref(true);

const tabs: { value: TabType; label: string; icon: string }[] = [
  { value: "Job Opening", label: "Saved Jobs", icon: "briefcase" },
  { value: "Supplier", label: "Saved Freelancers", icon: "users" },
];

const favorites = computed(() => favoritesStore.favorites);
const total = computed(() => favoritesStore.total);

async function loadFavorites() {
  isLoading.value = true;
  await favoritesStore.loadFavorites(activeTab.value);
  isLoading.value = false;
}

function switchTab(tab: TabType) {
  activeTab.value = tab;
  loadFavorites();
}

function getDetailUrl(favorite: FavoriteItem): string {
  if (favorite.reference_doctype === "Job Opening") {
    return `/job/${favorite.reference_name}`;
  }
  return `/freelancer/${favorite.reference_name}`;
}

onMounted(loadFavorites);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Saved</h1>
      <p class="text-gray-500 mt-1">Jobs and freelancers you've bookmarked</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="switchTab(tab.value)"
        :class="[
          'px-4 py-2.5 font-medium text-sm -mb-px border-b-2 transition-colors',
          activeTab === tab.value
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <LoadingSkeleton v-for="i in 5" :key="i" variant="list" />
    </div>

    <!-- Favorites List -->
    <div v-else-if="favorites.length" class="space-y-4">
      <RouterLink
        v-for="favorite in favorites"
        :key="favorite.name"
        :to="getDetailUrl(favorite)"
        class="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
      >
        <!-- Icon/Avatar -->
        <div v-if="favorite.reference_doctype === 'Supplier'" class="flex-shrink-0">
          <Avatar :name="favorite.reference_title" size="md" />
        </div>
        <div v-else class="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
            {{ favorite.reference_title }}
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <span v-if="favorite.reference_category" class="text-xs text-gray-400">
              {{ favorite.reference_category }}
            </span>
            <span v-if="favorite.reference_price" class="text-sm font-medium text-primary-600">
              {{ formatPrice(favorite.reference_price) }}
              <span v-if="favorite.reference_doctype === 'Supplier'">/hr</span>
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-1">
            Saved {{ timeAgo(favorite.creation) }}
          </p>
        </div>

        <!-- Remove Button -->
        <div class="flex-shrink-0" @click.prevent.stop>
          <FavoriteButton
            :reference-doctype="favorite.reference_doctype"
            :reference-name="favorite.reference_name"
            size="sm"
            variant="inline"
          />
        </div>
      </RouterLink>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :title="activeTab === 'Job Opening' ? 'No saved jobs' : 'No saved freelancers'"
      :description="activeTab === 'Job Opening'
        ? 'Save jobs you are interested in by tapping the heart icon.'
        : 'Save freelancers you want to work with by tapping the heart icon.'
      "
      icon="heart"
    >
      <RouterLink
        :to="activeTab === 'Job Opening' ? '/jobs' : '/talent'"
        class="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
      >
        {{ activeTab === 'Job Opening' ? 'Browse Jobs' : 'Browse Talent' }}
      </RouterLink>
    </EmptyState>
  </div>
</template>
