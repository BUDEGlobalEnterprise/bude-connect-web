<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore, useWalletStore } from "@bude/shared";
import { Footer } from "@bude/shared/components";
import Navbar from "./components/Navbar.vue";

const userStore = useUserStore();
const walletStore = useWalletStore();

onMounted(async () => {
  await userStore.fetchCurrentUser();

  if (userStore.isLoggedIn) {
    await walletStore.fetchBalance();
    await walletStore.loadUnlockedContacts();
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main class="pt-16 flex-1">
      <router-view />
    </main>
    <Footer variant="work" />
  </div>
</template>
