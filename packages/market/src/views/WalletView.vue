<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useWalletStore } from "@bude/shared";
import { getCreditPackages, getTransactions } from "@bude/shared/api";
import { formatPrice } from "@bude/shared/utils";
import {
  Button,
  Badge,
  EmptyState,
  LoadingSkeleton,
} from "@bude/shared/components";
import type { WalletTransaction } from "@bude/shared/types";
import BalanceCard from "../components/BalanceCard.vue";
import CreditPackageCard from "../components/CreditPackageCard.vue";
import TransactionItem from "../components/TransactionItem.vue";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount_percent?: number;
}

const walletStore = useWalletStore();
const packages = ref<CreditPackage[]>([]);
const transactions = ref<WalletTransaction[]>([]);
const isLoading = ref(true);
const activeTab = ref<"buy" | "history">("buy");

const balance = computed(() => walletStore.balance);

async function loadData() {
  isLoading.value = true;
  try {
    const [pkgs, txns] = await Promise.all([
      getCreditPackages(),
      getTransactions({ page: 1, page_size: 20 }),
    ]);
    packages.value = pkgs;
    transactions.value = txns.transactions;
  } catch (error) {
    console.error("Failed to load wallet data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleBuyCredits(packageId: string) {
  alert("Payment gateway integration coming soon!");
}

onMounted(loadData);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Wallet</h1>

    <BalanceCard :balance="balance" />

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <Button
        :variant="activeTab === 'buy' ? 'primary' : 'secondary'"
        @click="activeTab = 'buy'"
        >Buy Credits</Button
      >
      <Button
        :variant="activeTab === 'history' ? 'primary' : 'secondary'"
        @click="activeTab = 'history'"
        >Transaction History</Button
      >
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <LoadingSkeleton variant="list" v-for="i in 3" :key="i" />
    </div>

    <!-- Buy Credits -->
    <div v-else-if="activeTab === 'buy'" class="space-y-4">
      <CreditPackageCard
        v-for="pkg in packages"
        :key="pkg.id"
        :package="pkg"
        @buy="handleBuyCredits"
      />
      <EmptyState
        v-if="packages.length === 0"
        title="No packages available"
        icon="inbox"
      />
    </div>

    <!-- Transaction History -->
    <div v-else-if="activeTab === 'history'" class="space-y-3">
      <TransactionItem
        v-for="txn in transactions"
        :key="txn.name"
        :transaction="txn"
      />
      <EmptyState
        v-if="transactions.length === 0"
        title="No transactions yet"
        icon="inbox"
      />
    </div>
  </div>
</template>
