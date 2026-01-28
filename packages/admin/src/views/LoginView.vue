<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@bude/shared";
import { Button } from "@bude/shared/components";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const redirectIfLoggedIn = () => {
  if (userStore.isLoggedIn) {
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  }
};

onMounted(redirectIfLoggedIn);

const handleMarketLogin = () => {
  // If we want to centralize login, we could redirect to market
  // but for now let's just show a message or a simple login.
  // Given the monorepo structure, each app usually has its own login view.
  window.location.href = `http://localhost:3000/login?redirect=${encodeURIComponent(window.location.href)}`;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg">
          B
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Admin Portal</h1>
        <p class="text-slate-500 mt-2">Authentication Required</p>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p class="text-amber-800 text-sm">
          You are being redirected because your session has expired or you are not authorized to view this page.
        </p>
      </div>

      <div class="space-y-4">
        <Button 
          variant="default" 
          full-width 
          @click="handleMarketLogin"
        >
          Go to Market Login
        </Button>
        <p class="text-center text-xs text-slate-400">
          Admin authentication is currently centralized through the BudeGlobal Market.
        </p>
      </div>
    </div>
  </div>
</template>
