<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, useWalletStore } from "@bude/shared";
import { Button, Badge, LoadingSkeleton } from "@bude/shared/components";

const router = useRouter();
const userStore = useUserStore();
const walletStore = useWalletStore();

const isEditing = ref(false);
const isSaving = ref(false);
const success = ref("");

const form = ref({
  full_name: userStore.user?.full_name || "",
  mobile_no: userStore.user?.mobile_no || "",
});

const quickActions = [
  { icon: "📦", label: "My Listings", route: "/my-ads", count: "-" },
  { icon: "💰", label: "Wallet", route: "/wallet", count: `₹${walletStore.balance}` },
  { icon: "➕", label: "Post Ad", route: "/post", count: null },
];

const profileStats = computed(() => [
  { label: "Wallet Balance", value: `₹${walletStore.balance}`, icon: "💰" },
  { label: "Unlocked Contacts", value: walletStore.unlockedContacts?.length || 0, icon: "📇" },
  { label: "Member Since", value: userStore.user?.creation ? new Date(userStore.user.creation).getFullYear() : "N/A", icon: "📅" },
]);

async function handleSave() {
  isSaving.value = true;
  try {
    await userStore.updateProfile({
      full_name: form.value.full_name,
    });
    success.value = "Profile updated!";
    isEditing.value = false;
    setTimeout(() => { success.value = ""; }, 3000);
  } catch (e) {
    console.error("Failed to save:", e);
  } finally {
    isSaving.value = false;
  }
}

async function handleLogout() {
  await userStore.logout();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
      <div class="max-w-4xl mx-auto px-4 py-10">
        <h1 class="text-3xl font-bold mb-2">👤 My Account</h1>
        <p class="text-primary-100">Manage your profile and settings</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8 -mt-6 space-y-6">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {{ userStore.displayName.charAt(0).toUpperCase() }}
            </div>
          </div>
          
          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-gray-900">{{ userStore.displayName }}</h2>
              <Badge v-if="userStore.isVerified" variant="success" class="flex items-center gap-1">
                ✓ Verified
              </Badge>
            </div>
            <p class="text-gray-500 mb-4">{{ userStore.user?.email || userStore.user?.mobile_no }}</p>
            
            <!-- Stats -->
            <div class="flex gap-6">
              <div v-for="stat in profileStats" :key="stat.label" class="text-center">
                <p class="text-xl font-bold text-gray-900">{{ stat.icon }} {{ stat.value }}</p>
                <p class="text-xs text-gray-500">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Button -->
          <Button variant="ghost" @click="isEditing = !isEditing">
            {{ isEditing ? 'Cancel' : '✏️ Edit' }}
          </Button>
        </div>

        <!-- Edit Form -->
        <div v-if="isEditing" class="mt-6 pt-6 border-t border-gray-100">
          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input v-model="form.full_name" type="text" class="input" placeholder="Your name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input v-model="form.mobile_no" type="tel" class="input" placeholder="+91 98765 43210" disabled />
              </div>
            </div>
            <div class="flex gap-3">
              <Button type="submit" :loading="isSaving">Save Changes</Button>
              <span v-if="success" class="text-green-600 text-sm self-center">{{ success }}</span>
            </div>
          </form>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-3 gap-4">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.route"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center group"
        >
          <span class="text-3xl block mb-2 group-hover:scale-110 transition-transform">{{ action.icon }}</span>
          <h3 class="font-semibold text-gray-900">{{ action.label }}</h3>
          <p v-if="action.count" class="text-sm text-gray-500">{{ action.count }}</p>
        </RouterLink>
      </div>

      <!-- Settings Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">⚙️ Settings</h3>
        
        <div class="space-y-3">
          <RouterLink to="/onboarding" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span class="flex items-center gap-3">
              <span class="text-xl">🎯</span>
              <span>Complete Profile Setup</span>
            </span>
            <span class="text-gray-400">→</span>
          </RouterLink>
          
          <a href="https://budeglobal.in/privacy" target="_blank" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span class="flex items-center gap-3">
              <span class="text-xl">🔒</span>
              <span>Privacy Policy</span>
            </span>
            <span class="text-gray-400">↗</span>
          </a>
          
          <a href="https://budeglobal.in/terms" target="_blank" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span class="flex items-center gap-3">
              <span class="text-xl">📋</span>
              <span>Terms of Service</span>
            </span>
            <span class="text-gray-400">↗</span>
          </a>
          
          <button @click="handleLogout" class="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600">
            <span class="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
