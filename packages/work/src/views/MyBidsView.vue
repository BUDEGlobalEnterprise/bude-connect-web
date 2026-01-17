<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getMyBids, withdrawProposal } from "@bude/shared/api";
import type { Bid, JobOpening } from "@bude/shared/types";

const bids = ref<(Bid & { job: JobOpening })[]>([]);
const isLoading = ref(true);
const activeTab = ref<"pending" | "accepted" | "rejected">("pending");

const statusMap: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

async function loadBids() {
  isLoading.value = true;
  try {
    const result = await getMyBids({ status: statusMap[activeTab.value] });
    bids.value = result.data;
  } catch (error) {
    console.error("Failed to load bids:", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleWithdraw(bidId: string) {
  try {
    await withdrawProposal(bidId);
    loadBids();
  } catch (error) {
    console.error("Failed to withdraw:", error);
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

onMounted(loadBids);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Bids</h1>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in ['pending', 'accepted', 'rejected'] as const"
        :key="tab"
        @click="
          activeTab = tab;
          loadBids();
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
      <div v-for="i in 3" :key="i" class="card p-4 animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Bids -->
    <div v-else-if="bids.length > 0" class="space-y-4">
      <div v-for="bid in bids" :key="bid.name" class="card p-4">
        <div class="flex items-start justify-between mb-2">
          <div>
            <RouterLink
              :to="`/jobs/${bid.job_opening}`"
              class="font-medium text-gray-900 hover:text-primary-600"
            >
              {{ bid.job?.title || "Job" }}
            </RouterLink>
            <p class="text-sm text-gray-500">
              Your bid: {{ formatPrice(bid.bid_amount) }}
            </p>
          </div>
          <span
            :class="[
              'badge',
              bid.status === 'Accepted'
                ? 'badge-verified'
                : bid.status === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700',
            ]"
          >
            {{ bid.status }}
          </span>
        </div>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">
          {{ bid.proposal_text }}
        </p>
        <button
          v-if="bid.status === 'Pending'"
          @click="handleWithdraw(bid.name)"
          class="text-sm text-red-600 hover:underline"
        >
          Withdraw Proposal
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16 text-gray-500">
      <p>No {{ activeTab }} bids</p>
      <RouterLink
        to="/jobs"
        class="text-primary-600 hover:underline mt-2 inline-block"
      >
        Browse Jobs
      </RouterLink>
    </div>
  </div>
</template>
