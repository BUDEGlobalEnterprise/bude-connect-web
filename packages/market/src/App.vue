<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore, useWalletStore } from "@bude/shared";
import { Footer, BottomNav } from "@bude/shared/components";
import Navbar from "./components/Navbar.vue";

const userStore = useUserStore();
const walletStore = useWalletStore();

const navItems = [
  { to: "/", label: "Home", icon: "🏠", activeIcon: "🏡" },
  { to: "/search", label: "Search", icon: "🔍", activeIcon: "🔎" },
  { to: "/post", label: "Post", icon: "➕", activeIcon: "✚" },
  { to: "/wallet", label: "Wallet", icon: "💰", activeIcon: "💵" },
  { to: "/profile", label: "Profile", icon: "👤", activeIcon: "👤" },
];

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
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main class="pt-16 pb-20 lg:pb-0 flex-1">
      <router-view />
    </main>
    <Footer class="hidden lg:block" />
    <BottomNav :items="navItems" />
  </div>
</template>

