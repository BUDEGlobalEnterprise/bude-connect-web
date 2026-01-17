<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUserStore, useWalletStore } from "@bude/shared";

const router = useRouter();
const userStore = useUserStore();
const walletStore = useWalletStore();

const displayName = computed(() => userStore.displayName);
const balance = computed(() => walletStore.balance);

async function handleLogout() {
  await userStore.logout();
  walletStore.reset();
  router.push("/");
}
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">B</span>
          </div>
          <span class="font-bold text-xl text-gray-900">Market</span>
        </RouterLink>

        <!-- Search (desktop) -->
        <div class="hidden md:flex flex-1 max-w-xl mx-8">
          <div class="relative w-full">
            <input
              type="text"
              placeholder="Search for anything..."
              class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
            <svg
              class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <RouterLink
            v-if="userStore.isLoggedIn"
            to="/post"
            class="btn btn-primary"
          >
            <svg
              class="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Post Ad
          </RouterLink>

          <div v-if="userStore.isLoggedIn" class="flex items-center gap-3">
            <!-- Wallet Balance -->
            <RouterLink
              to="/wallet"
              class="flex items-center gap-1 px-3 py-1.5 bg-accent-50 text-accent-700 rounded-full font-medium"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ balance }} Credits
            </RouterLink>

            <!-- User Menu -->
            <div class="relative group">
              <button
                class="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-primary-700 text-sm font-medium">
                    {{ displayName.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </button>

              <!-- Dropdown -->
              <div
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <div class="p-3 border-b border-gray-100">
                  <p class="font-medium text-gray-900 truncate">
                    {{ displayName }}
                  </p>
                </div>
                <div class="py-1">
                  <RouterLink
                    to="/my-ads"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >My Ads</RouterLink
                  >
                  <RouterLink
                    to="/wallet"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >Wallet</RouterLink
                  >
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <RouterLink v-else to="/login" class="btn btn-secondary">
            Login
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
