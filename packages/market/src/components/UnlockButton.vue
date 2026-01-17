<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, useWalletStore } from "@bude/shared";

const props = defineProps<{
  doctype: "Item" | "Supplier";
  docname: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const router = useRouter();
const userStore = useUserStore();
const walletStore = useWalletStore();

const isLoading = ref(false);
const error = ref<string | null>(null);

const balance = computed(() => walletStore.balance);
const hasCredits = computed(() => balance.value > 0);

async function handleUnlock() {
  if (!userStore.isLoggedIn) {
    router.push({
      name: "login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
    return;
  }

  if (!hasCredits.value) {
    router.push({ name: "wallet" });
    return;
  }

  isLoading.value = true;
  error.value = null;

  const result = await walletStore.unlockContact(props.doctype, props.docname);

  isLoading.value = false;

  if (result.success) {
    emit("success");
  } else {
    error.value = result.error || "Failed to unlock contact";
  }
}
</script>

<template>
  <div>
    <button
      @click="handleUnlock"
      :disabled="isLoading"
      class="w-full btn btn-primary py-3 text-lg"
    >
      <template v-if="isLoading">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Unlocking...
      </template>
      <template v-else-if="!userStore.isLoggedIn">
        Login to Contact Seller
      </template>
      <template v-else-if="!hasCredits"> Buy Credits to Unlock </template>
      <template v-else>
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
        Unlock Contact (1 Credit)
      </template>
    </button>

    <p
      v-if="!isLoading && hasCredits"
      class="text-center text-sm text-gray-500 mt-2"
    >
      Balance: {{ balance }} credits
    </p>

    <p v-if="error" class="text-center text-sm text-red-600 mt-2">
      {{ error }}
    </p>
  </div>
</template>
