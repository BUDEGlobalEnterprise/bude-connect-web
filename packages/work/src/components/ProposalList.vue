<script setup lang="ts">
import { formatPrice } from "@bude/shared/utils";
import type { Bid } from "@bude/shared/types";

defineProps<{ bids: Bid[] }>();
</script>

<template>
  <div class="card p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Proposals ({{ bids.length }})
    </h2>
    <div class="space-y-4">
      <div
        v-for="bid in bids"
        :key="bid.name"
        class="p-4 border border-gray-200 rounded-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-gray-900">{{ bid.supplier_name }}</span>
          <span class="font-bold text-primary-600">{{
            formatPrice(bid.bid_amount)
          }}</span>
        </div>
        <p class="text-gray-600">{{ bid.proposal_text }}</p>
      </div>
    </div>
  </div>
</template>
