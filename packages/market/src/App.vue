<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore, useWalletStore } from "@bude/shared";
import Navbar from "./components/Navbar.vue";

const userStore = useUserStore();
const walletStore = useWalletStore();

onMounted(async () => {
  // Try to restore session
  await userStore.fetchCurrentUser();

  if (userStore.isLoggedIn) {
    await walletStore.fetchBalance();
    await walletStore.loadUnlockedContacts();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>
