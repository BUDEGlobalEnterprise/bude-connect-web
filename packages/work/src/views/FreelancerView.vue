<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getFreelancer } from "@bude/shared/api";
import { useUserStore, useWalletStore } from "@bude/shared";
import { formatPrice } from "@bude/shared/utils";
import { Avatar, Badge, LoadingSkeleton, ReviewSection, FavoriteButton, ReportDialog } from "@bude/shared/components";
import type { Freelancer } from "@bude/shared/types";
import UnlockButton from "../components/UnlockButton.vue";
import ContactCard from "../components/ContactCard.vue";
import SkillTags from "../components/SkillTags.vue";
import PortfolioLinks from "../components/PortfolioLinks.vue";

const route = useRoute();
const walletStore = useWalletStore();

const freelancer = ref<Freelancer | null>(null);
const isLoading = ref(true);
const showReportDialog = ref(false);

const contactUnlocked = computed(
  () =>
    freelancer.value &&
    walletStore.isUnlocked("Supplier", freelancer.value.name),
);
const cachedContact = computed(
  () =>
    freelancer.value &&
    walletStore.getCachedContact("Supplier", freelancer.value.name),
);

async function loadFreelancer() {
  isLoading.value = true;
  try {
    freelancer.value = await getFreelancer(route.params.id as string);
  } catch (error) {
    console.error("Failed to load freelancer:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadFreelancer);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="space-y-6">
      <LoadingSkeleton variant="list" />
      <LoadingSkeleton variant="text" />
    </div>

    <!-- Content -->
    <div v-else-if="freelancer">
      <!-- Header -->
      <div class="card p-6 mb-6">
        <div class="flex items-start gap-6">
          <Avatar
            :name="freelancer.supplier_name"
            size="xl"
            :verified="freelancer.is_verified_expert"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ freelancer.supplier_name }}
                </h1>
                <Badge v-if="freelancer.is_verified_expert" variant="success"
                  >Verified Expert</Badge
                >
              </div>
              <div class="flex items-center gap-2">
                <FavoriteButton
                  reference-doctype="Supplier"
                  :reference-name="freelancer.name"
                  size="md"
                  variant="inline"
                />
                <button
                  @click="showReportDialog = true"
                  class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Report profile"
                >
                  <svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-2xl font-bold text-primary-600 mb-2">
              {{ formatPrice(freelancer.hourly_rate) }}/hr
            </p>
            <p class="text-gray-500">
              {{ freelancer.completed_jobs }} jobs completed • Member since
              {{ freelancer.member_since }}
            </p>
          </div>
        </div>
        <p v-if="freelancer.bio" class="text-gray-700 mt-6">
          {{ freelancer.bio }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <SkillTags :skills="freelancer.skills" />
          <PortfolioLinks
            v-if="freelancer.portfolio_links?.length"
            :links="freelancer.portfolio_links"
          />
        </div>

        <!-- Contact Card -->
        <div class="card p-6 h-fit sticky top-24">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
          <ContactCard
            v-if="contactUnlocked && cachedContact"
            :contact="cachedContact"
          />
          <UnlockButton v-else doctype="Supplier" :docname="freelancer.name" />
        </div>
      </div>

      <!-- Reviews -->
      <div class="mt-10">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
        <ReviewSection
          :user-id="(route.params.id as string)"
          reference-doctype="Supplier"
          :reference-name="freelancer.name"
        />
      </div>
    </div>

    <!-- Report Dialog -->
    <ReportDialog
      v-if="freelancer"
      :open="showReportDialog"
      :reference-doctype="'Supplier'"
      :reference-name="freelancer.name"
      @update:open="showReportDialog = $event"
    />
  </div>
</template>
