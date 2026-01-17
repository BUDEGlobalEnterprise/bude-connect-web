<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItem } from "@bude/shared/api";
import { useUserStore, useWalletStore } from "@bude/shared";
import { formatPrice } from "@bude/shared/utils";
import {
  Avatar,
  Badge,
  LazyImage,
  LoadingSkeleton,
} from "@bude/shared/components";
import type { MarketItemDetail } from "@bude/shared/types";
import UnlockButton from "../components/UnlockButton.vue";
import ImageGallery from "../components/ImageGallery.vue";
import ContactCard from "../components/ContactCard.vue";
import SafetyTips from "../components/SafetyTips.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const walletStore = useWalletStore();

const item = ref<MarketItemDetail | null>(null);
const isLoading = ref(true);

const isOwnListing = computed(() => item.value?.owner === userStore.user?.name);
const contactUnlocked = computed(
  () => item.value && walletStore.isUnlocked("Item", item.value.name),
);
const cachedContact = computed(
  () => item.value && walletStore.getCachedContact("Item", item.value.name),
);

async function loadItem() {
  isLoading.value = true;
  try {
    item.value = await getItem(route.params.id as string);
  } catch (error) {
    console.error("Failed to load item:", error);
    router.push("/");
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadItem);
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="grid md:grid-cols-2 gap-8">
      <LoadingSkeleton variant="card" />
      <div class="space-y-4">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" />
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="item" class="grid md:grid-cols-2 gap-8">
      <!-- Images -->
      <ImageGallery
        :images="item.images || [item.image]"
        :alt="item.item_name"
      />

      <!-- Details -->
      <div>
        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge variant="success">{{ item.condition }}</Badge>
          <Badge variant="info">{{ item.listing_type }}</Badge>
          <Badge>{{ item.item_group }}</Badge>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {{ item.item_name }}
        </h1>

        <div class="text-3xl font-bold text-primary-600 mb-6">
          {{ formatPrice(item.standard_rate) }}
        </div>

        <!-- Description -->
        <div class="prose prose-gray max-w-none mb-8">
          <p>{{ item.description }}</p>
        </div>

        <!-- Seller Info & Contact -->
        <div class="card p-4 mb-6">
          <div class="flex items-center gap-4 mb-4">
            <Avatar :name="item.seller_name || 'Seller'" size="lg" />
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

          <ContactCard
            v-else-if="contactUnlocked && cachedContact"
            :contact="cachedContact"
          />

          <UnlockButton
            v-else
            doctype="Item"
            :docname="item.name"
            @success="() => {}"
          />
        </div>

        <SafetyTips />
      </div>
    </div>
  </div>
</template>
