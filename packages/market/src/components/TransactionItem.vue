<script setup lang="ts">
import type { WalletTransaction } from "@bude/shared/types";

defineProps<{ transaction: WalletTransaction }>();

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="card p-4 flex items-center justify-between">
    <div>
      <p class="font-medium text-gray-900">{{ transaction.description }}</p>
      <p class="text-sm text-gray-500">
        {{ formatDate(transaction.timestamp) }}
      </p>
    </div>
    <span
      :class="[
        'font-bold',
        transaction.transaction_type === 'Credit'
          ? 'text-green-600'
          : 'text-red-600',
      ]"
    >
      {{ transaction.transaction_type === "Credit" ? "+" : "-"
      }}{{ transaction.amount }}
    </span>
  </div>
</template>
