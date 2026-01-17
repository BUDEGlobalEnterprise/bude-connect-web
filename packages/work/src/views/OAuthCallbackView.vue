<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore, useWalletStore } from "@bude/shared";
import { LoadingSkeleton } from "@bude/shared/components";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const walletStore = useWalletStore();

const error = ref("");

onMounted(async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;

  if (!code) {
    error.value = "Invalid OAuth callback - no code provided";
    return;
  }

  const result = await userStore.handleGoogleCallback(code, state);

  if (result.success) {
    await walletStore.fetchBalance();
    const redirect = sessionStorage.getItem("login_redirect") || "/";
    sessionStorage.removeItem("login_redirect");
    router.push(redirect);
  } else {
    error.value = result.message || "OAuth login failed";
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div v-if="error" class="text-center">
      <div
        class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Login Failed</h1>
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <router-link to="/login" class="text-primary-600 hover:underline"
        >Try again</router-link
      >
    </div>
    <div v-else class="text-center">
      <LoadingSkeleton variant="card" class="mb-4" />
      <p class="text-gray-500">Completing login...</p>
    </div>
  </div>
</template>
