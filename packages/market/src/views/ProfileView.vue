<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, useWalletStore } from "@bude/shared";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  Input,
  StatCard,
  ProfileCompletenessMeter,
} from "@bude/shared/components";

const router = useRouter();
const userStore = useUserStore();
const walletStore = useWalletStore();

const isEditing = ref(false);
const isSaving = ref(false);
const success = ref("");
const activeTab = ref("overview");

const form = ref({
  full_name: userStore.user?.full_name || "",
  mobile_no: userStore.user?.mobile_no || "",
  email: userStore.user?.email || "",
});

const tabs = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "security", label: "Security", icon: "eye" },
];

const quickActions = [
  { icon: "shopping-bag", label: "My Listings", route: "/my-ads", description: "Manage your ads" },
  { icon: "wallet", label: "Wallet", route: "/wallet", description: `₹${walletStore.balance} balance` },
  { icon: "plus", label: "Post Ad", route: "/post", description: "Create new listing" },
  { icon: "message-circle", label: "Messages", route: "/messages", description: "View conversations" },
];

const stats = computed(() => [
  {
    title: "Wallet Balance",
    value: `₹${walletStore.balance || 0}`,
    icon: "wallet",
    iconBg: "bg-primary-50 text-primary-600",
    change: 12,
    changeLabel: "vs last month",
    trend: "up" as const,
  },
  {
    title: "Unlocked Contacts",
    value: walletStore.unlockedContacts?.length || 0,
    icon: "users",
    iconBg: "bg-success-50 text-success-600",
  },
  {
    title: "Active Listings",
    value: "-",
    icon: "shopping-bag",
    iconBg: "bg-warning-50 text-warning-600",
  },
  {
    title: "Profile Views",
    value: "-",
    icon: "eye",
    iconBg: "bg-gray-100 text-gray-600",
  },
]);

const settingsItems = [
  { icon: "user", label: "Edit Profile", description: "Update your personal info", action: () => isEditing.value = true },
  { icon: "bell", label: "Notifications", description: "Manage notification preferences", route: "/settings/notifications" },
  { icon: "eye", label: "Privacy", description: "Control your privacy settings", route: "/settings/privacy" },
  { icon: "credit-card", label: "Payment Methods", description: "Manage payment options", route: "/settings/payments" },
];

const securityItems = [
  { icon: "check-circle", label: "Verify Account", description: "Complete KYC verification", route: "/kyc" },
  { icon: "mail", label: "Email Verification", description: "Verify your email address", route: "/verify-email" },
  { icon: "phone", label: "Phone Verification", description: "Your phone is verified", verified: true },
];

async function handleSave() {
  isSaving.value = true;
  try {
    await userStore.updateProfile({
      full_name: form.value.full_name,
    });
    success.value = "Profile updated successfully!";
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
    <header class="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Icon name="arrow-left" size="sm" />
            </button>
            <h1 class="text-lg font-semibold text-gray-900">Account</h1>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="ghost" size="sm" @click="router.push('/messages')">
              <Icon name="message-circle" size="sm" />
            </Button>
            <Button variant="ghost" size="sm" @click="router.push('/notifications')">
              <Icon name="bell" size="sm" />
            </Button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Profile Header Card -->
      <Card class="mb-6" padding="none">
        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <!-- Avatar Section -->
            <div class="relative group">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                {{ userStore.displayName?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <button
                class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border-2 border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Icon name="edit" size="xs" class="text-gray-600" />
              </button>
            </div>

            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {{ userStore.displayName || 'User' }}
                </h2>
                <Badge v-if="userStore.isVerified" class="bg-success-50 text-success-600 border-success-200">
                  <Icon name="check" size="xs" class="mr-1" />
                  Verified
                </Badge>
              </div>
              <p class="text-gray-500 text-sm mb-3">
                {{ userStore.user?.email || userStore.user?.mobile_no }}
              </p>
              <div class="flex flex-wrap gap-2">
                <Button size="sm" @click="isEditing = true">
                  <Icon name="edit" size="xs" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" @click="router.push('/kyc')">
                  <Icon name="check-circle" size="xs" />
                  Verify Account
                </Button>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="hidden lg:flex items-center gap-6 text-center">
              <div>
                <p class="text-2xl font-bold text-gray-900">₹{{ walletStore.balance || 0 }}</p>
                <p class="text-xs text-gray-500">Balance</p>
              </div>
              <div class="w-px h-12 bg-gray-200" />
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ walletStore.unlockedContacts?.length || 0 }}</p>
                <p class="text-xs text-gray-500">Contacts</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-t border-gray-100 px-6">
          <nav class="flex gap-6 -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <Icon :name="tab.icon" size="sm" />
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </Card>

      <!-- Tab Content -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            v-for="stat in stats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
            :icon="stat.icon"
            :icon-bg="stat.iconBg"
            :change="stat.change"
            :change-label="stat.changeLabel"
            :trend="stat.trend"
          />
        </div>

        <!-- Profile Completeness -->
        <ProfileCompletenessMeter :user="userStore.user" @navigate="router.push($event)" />

        <!-- Quick Actions -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              v-for="action in quickActions"
              :key="action.label"
              clickable
              padding="md"
              @click="router.push(action.route)"
              class="group"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                  <Icon :name="action.icon" size="lg" />
                </div>
                <h4 class="font-medium text-gray-900 mb-1">{{ action.label }}</h4>
                <p class="text-xs text-gray-500">{{ action.description }}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-else-if="activeTab === 'settings'" class="space-y-4">
        <Card padding="none">
          <div class="divide-y divide-gray-100">
            <button
              v-for="item in settingsItems"
              :key="item.label"
              @click="item.action ? item.action() : item.route && router.push(item.route)"
              class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                <Icon :name="item.icon" size="sm" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900">{{ item.label }}</p>
                <p class="text-sm text-gray-500">{{ item.description }}</p>
              </div>
              <Icon name="chevron-right" size="sm" class="text-gray-400" />
            </button>
          </div>
        </Card>

        <!-- Logout -->
        <Card padding="none">
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left text-destructive"
          >
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Icon name="logout" size="sm" />
            </div>
            <div class="flex-1">
              <p class="font-medium">Log Out</p>
              <p class="text-sm text-gray-500">Sign out of your account</p>
            </div>
          </button>
        </Card>
      </div>

      <!-- Security Tab -->
      <div v-else-if="activeTab === 'security'" class="space-y-4">
        <Card padding="none">
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in securityItems"
              :key="item.label"
              class="flex items-center gap-4 p-4"
            >
              <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center',
                item.verified ? 'bg-success-50 text-success-600' : 'bg-gray-100 text-gray-600',
              ]">
                <Icon :name="item.icon" size="sm" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900">{{ item.label }}</p>
                <p class="text-sm text-gray-500">{{ item.description }}</p>
              </div>
              <Badge v-if="item.verified" class="bg-success-50 text-success-600">
                Verified
              </Badge>
              <Button v-else variant="outline" size="sm" @click="item.route && router.push(item.route)">
                Verify
              </Button>
            </div>
          </div>
        </Card>

        <!-- Legal Links -->
        <Card padding="none">
          <a
            href="https://budeglobal.in/privacy"
            target="_blank"
            class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Icon name="file" size="sm" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">Privacy Policy</p>
              <p class="text-sm text-gray-500">Read our privacy policy</p>
            </div>
            <Icon name="external-link" size="sm" class="text-gray-400" />
          </a>
          <a
            href="https://budeglobal.in/terms"
            target="_blank"
            class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Icon name="file" size="sm" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">Terms of Service</p>
              <p class="text-sm text-gray-500">Read our terms of service</p>
            </div>
            <Icon name="external-link" size="sm" class="text-gray-400" />
          </a>
        </Card>
      </div>

      <!-- Edit Profile Modal -->
      <Teleport to="body">
        <div
          v-if="isEditing"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="isEditing = false"
        >
          <Card class="w-full max-w-md animate-scale-in" padding="none">
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button
                @click="isEditing = false"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            <form @submit.prevent="handleSave" class="p-6 space-y-4">
              <Input
                v-model="form.full_name"
                label="Full Name"
                placeholder="Enter your full name"
                required
              />
              <Input
                v-model="form.email"
                type="email"
                label="Email"
                placeholder="your@email.com"
                disabled
                hint="Email cannot be changed"
              />
              <Input
                v-model="form.mobile_no"
                type="tel"
                label="Phone"
                placeholder="+91 98765 43210"
                disabled
                hint="Phone cannot be changed"
              />

              <div v-if="success" class="p-3 rounded-lg bg-success-50 text-success-600 text-sm flex items-center gap-2">
                <Icon name="check-circle" size="sm" />
                {{ success }}
              </div>

              <div class="flex gap-3 pt-2">
                <Button type="button" variant="outline" class="flex-1" @click="isEditing = false">
                  Cancel
                </Button>
                <Button type="submit" :loading="isSaving" class="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Teleport>
    </main>
  </div>
</template>
