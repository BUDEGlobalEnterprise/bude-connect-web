<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItem } from "@bude/shared/api";
import { useUserStore, useWalletStore } from "@bude/shared";
import type { MarketItemDetail } from "@bude/shared/types";
import UnlockButton from "../components/UnlockButton.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const walletStore = useWalletStore();

const item = ref<MarketItemDetail | null>(null);
const isLoading = ref(true);
const activeImageIndex = ref(0);

const formattedPrice = computed(() => {
  if (!item.value) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(item.value.standard_rate);
});

const isOwnListing = computed(() => {
  return item.value?.owner === userStore.user?.name;
});

const contactUnlocked = computed(() => {
  if (!item.value) return false;
  return walletStore.isUnlocked("Item", item.value.name);
});

const cachedContact = computed(() => {
  if (!item.value) return null;
  return walletStore.getCachedContact("Item", item.value.name);
});

async function loadItem() {
  isLoading.value = true;
  try {
    const itemCode = route.params.id as string;
    item.value = await getItem(itemCode);
  } catch (error) {
    console.error("Failed to load item:", error);
    router.push("/");
  } finally {
    isLoading.value = false;
  }
}

function handleUnlockSuccess() {
  // Contact info is now in wallet store cache
}

onMounted(loadItem);
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="grid md:grid-cols-2 gap-8">
        <div class="aspect-square bg-gray-200 rounded-2xl"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-12 bg-gray-200 rounded w-1/2"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="item" class="grid md:grid-cols-2 gap-8">
      <!-- Images -->
      <div>
        <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
          <img
            v-if="item.images?.[activeImageIndex] || item.image"
            :src="item.images?.[activeImageIndex] || item.image"
            :alt="item.item_name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Thumbnails -->
        <div
          v-if="item.images && item.images.length > 1"
          class="flex gap-2 overflow-x-auto"
        >
          <button
            v-for="(img, index) in item.images"
            :key="index"
            @click="activeImageIndex = index"
            :class="[
              'w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
              activeImageIndex === index
                ? 'border-primary-500'
                : 'border-transparent',
            ]"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Details -->
      <div>
        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="badge badge-success">{{ item.condition }}</span>
          <span class="badge badge-info">{{ item.listing_type }}</span>
          <span class="badge bg-gray-100 text-gray-700">{{
            item.item_group
          }}</span>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {{ item.item_name }}
        </h1>

        <div class="text-3xl font-bold text-primary-600 mb-6">
          {{ formattedPrice }}
        </div>

        <!-- Description -->
        <div class="prose prose-gray max-w-none mb-8">
          <p>{{ item.description }}</p>
        </div>

        <!-- Seller Info -->
        <div class="card p-4 mb-6">
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <span class="text-primary-700 font-medium text-lg">
                {{ item.seller_name?.charAt(0) || "S" }}
              </span>
            </div>
            <div>
              <p class="font-medium text-gray-900">
                {{ item.seller_name || "Seller" }}
              </p>
              <p class="text-sm text-gray-500">
                Member since {{ new Date(item.created).getFullYear() }}
              </p>
            </div>
          </div>

          <!-- Contact Section -->
          <div v-if="isOwnListing" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">This is your listing</p>
          </div>

          <div v-else-if="contactUnlocked && cachedContact" class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                :href="`tel:${cachedContact.phone}`"
                class="font-medium text-green-700"
              >
                {{ cachedContact.phone }}
              </a>
            </div>
            <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <svg
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                :href="`mailto:${cachedContact.email}`"
                class="font-medium text-blue-700"
              >
                {{ cachedContact.email }}
              </a>
            </div>
          </div>

          <UnlockButton
            v-else
            doctype="Item"
            :docname="item.name"
            @success="handleUnlockSuccess"
          />
        </div>

        <!-- Safety Tips -->
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 class="font-medium text-yellow-800 mb-2 flex items-center gap-2">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Safety Tips
          </h4>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• Meet in a safe, public place</li>
            <li>• Check the item before paying</li>
            <li>• Pay only after collecting the item</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
