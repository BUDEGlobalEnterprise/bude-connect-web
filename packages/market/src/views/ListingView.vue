<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getItem } from "@bude/shared/api";
import { useUserStore, useWalletStore } from "@bude/shared";
import { formatPrice, timeAgo } from "@bude/shared/utils";
import {
  Avatar,
  Badge,
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

const conditionConfig = computed(() => {
  type BadgeVariant = "default" | "success" | "secondary" | "warning" | "destructive" | "outline";
  if (!item.value) return { variant: "default" as BadgeVariant, icon: "📦" };
  const config: Record<string, { variant: BadgeVariant; icon: string }> = {
    New: { variant: "success", icon: "✨" },
    "Like New": { variant: "secondary", icon: "👌" },
    "Good": { variant: "secondary", icon: "👍" },
    "Fair": { variant: "warning", icon: "📦" },
    "Open Box": { variant: "secondary", icon: "📭" },
    Refurbished: { variant: "warning", icon: "🔧" },
    Used: { variant: "default", icon: "🔄" },
  };
  return config[item.value.condition] || { variant: "default" as BadgeVariant, icon: "📦" };
});

const listingTypeConfig = computed(() => {
  const config: Record<string, { bg: string; label: string; icon: string }> = {
    Sell: { bg: "bg-emerald-500", label: "For Sale", icon: "🛒" },
    Rent: { bg: "bg-blue-500", label: "For Rent", icon: "🔄" },
    Surplus: { bg: "bg-amber-500", label: "Surplus", icon: "📦" },
    Scrap: { bg: "bg-slate-500", label: "Scrap", icon: "♻️" },
  };
  return config[item.value?.listingType || "Sell"] || config["Sell"];
});

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

function goBack() {
  router.back();
}

onMounted(loadItem);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Back Button -->
    <div class="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <button @click="goBack" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">Back</span>
        </button>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      <div v-if="isLoading" class="grid md:grid-cols-2 gap-8 animate-fade-in">
        <div class="aspect-square rounded-2xl overflow-hidden">
          <LoadingSkeleton variant="card" class="h-full" />
        </div>
        <div class="space-y-6">
          <LoadingSkeleton variant="default" class="h-8 w-3/4" />
          <LoadingSkeleton variant="default" class="h-12 w-1/3" />
          <LoadingSkeleton variant="default" class="h-24" />
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="item" class="grid md:grid-cols-2 gap-8 animate-slide-up">
        <!-- Images -->
        <div class="space-y-4">
          <ImageGallery
            :images="item.images || [item.image]"
            :alt="item.itemName"
            class="rounded-2xl overflow-hidden shadow-lg"
          />
        </div>

        <!-- Details -->
        <div class="space-y-6">
          <!-- Type Badge -->
          <div class="flex items-center gap-3">
            <span
              :class="[
                listingTypeConfig.bg,
                'inline-flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg',
              ]"
            >
              <span>{{ listingTypeConfig.icon }}</span>
              {{ listingTypeConfig.label }}
            </span>
            <Badge variant="default">{{ item.itemGroup }}</Badge>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
            {{ item.itemName }}
          </h1>

          <!-- Price -->
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-bold text-gradient">
              {{ formatPrice(item.standardRate) }}
            </span>
            <span v-if="item.listingType === 'Rent'" class="text-lg text-gray-500">/day</span>
          </div>

          <!-- Condition -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div class="flex-1">
              <p class="text-sm text-gray-500">Condition</p>
              <Badge :variant="conditionConfig.variant" class="font-semibold text-gray-900">
                {{ conditionConfig.icon }} {{ item.condition }}
              </Badge>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Posted</p>
              <p class="font-semibold text-gray-900">{{ timeAgo(item.createdAt) }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">{{ item.description }}</p>
          </div>

          <!-- Seller Info & Contact Card -->
          <div class="card p-6">
            <div class="flex items-center gap-4 mb-4">
              <Avatar :name="item.sellerInfo?.name || item.sellerName || 'Seller'" size="lg" />
              <div class="flex-1">
                <p class="font-semibold text-gray-900">
                  {{ item.sellerInfo?.name || item.sellerName || "Seller" }}
                </p>
                <p class="text-sm text-gray-500">
                  Member since {{ new Date(item.sellerInfo?.memberSince || item.createdAt).getFullYear() }}
                </p>
              </div>
              <RouterLink
                v-if="item.owner"
                :to="`/seller/${item.owner}`"
                class="text-primary-600 text-sm font-medium hover:underline"
              >
                View Profile →
              </RouterLink>
            </div>

            <hr class="my-4 border-gray-100" />

            <!-- Contact Section -->
            <div v-if="isOwnListing" class="p-4 bg-primary-50 rounded-xl text-center">
              <p class="text-sm text-primary-700 font-medium">✨ This is your listing</p>
              <RouterLink to="/my-ads" class="text-primary-600 text-sm hover:underline mt-1 inline-block">
                Edit listing →
              </RouterLink>
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
  </div>
</template>
