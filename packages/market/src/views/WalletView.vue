<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useWalletStore } from "@bude/shared";
import { getCreditPackages, getTransactions } from "@bude/shared/api";
import type { WalletTransaction } from "@bude/shared/types";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function handleBuyCredits(packageId: string) {
  // TODO: Integrate with payment gateway
  alert("Payment gateway integration coming soon!");
}

onMounted(loadData);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Wallet</h1>

    <!-- Balance Card -->
    <div
      class="card p-6 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 text-white"
    >
      <p class="text-sm text-white/80 mb-1">Available Balance</p>
      <p class="text-4xl font-bold">{{ balance }} Credits</p>
      <p class="text-sm text-white/70 mt-2">1 credit = 1 contact unlock</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        @click="activeTab = 'buy'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          activeTab === 'buy'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        Buy Credits
      </button>
      <button
        @click="activeTab = 'history'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          activeTab === 'history'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        Transaction History
      </button>
    </div>

    <!-- Buy Credits -->
    <div v-if="activeTab === 'buy'" class="space-y-4">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="card p-4 flex items-center justify-between"
      >
        <div>
          <h3 class="font-medium text-gray-900">{{ pkg.name }}</h3>
          <p class="text-2xl font-bold text-primary-600">
            {{ pkg.credits }} Credits
          </p>
          <p v-if="pkg.discount_percent" class="text-sm text-green-600">
            Save {{ pkg.discount_percent }}%
          </p>
        </div>
        <button @click="handleBuyCredits(pkg.id)" class="btn btn-primary">
          {{ formatPrice(pkg.price) }}
        </button>
      </div>

      <div
        v-if="packages.length === 0 && !isLoading"
        class="text-center py-8 text-gray-500"
      >
        No credit packages available
      </div>
    </div>

    <!-- Transaction History -->
    <div v-if="activeTab === 'history'" class="space-y-3">
      <div
        v-for="txn in transactions"
        :key="txn.name"
        class="card p-4 flex items-center justify-between"
      >
        <div>
          <p class="font-medium text-gray-900">{{ txn.description }}</p>
          <p class="text-sm text-gray-500">{{ formatDate(txn.timestamp) }}</p>
        </div>
        <span
          :class="[
            'font-bold',
            txn.transaction_type === 'Credit'
              ? 'text-green-600'
              : 'text-red-600',
          ]"
        >
          {{ txn.transaction_type === "Credit" ? "+" : "-" }}{{ txn.amount }}
        </span>
      </div>

      <div
        v-if="transactions.length === 0 && !isLoading"
        class="text-center py-8 text-gray-500"
      >
        No transactions yet
      </div>
    </div>
  </div>
</template>
