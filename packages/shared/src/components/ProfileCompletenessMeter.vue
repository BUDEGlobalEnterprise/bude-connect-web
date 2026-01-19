<script setup lang="ts">
import { computed } from "vue";
import type { User } from "../types";

interface ProfileItem {
  key: string;
  label: string;
  complete: boolean;
  route?: string;
  weight: number;
}

const props = defineProps<{
  user: User | null;
}>();

const emit = defineEmits<{
  (e: "navigate", route: string): void;
}>();

const profileItems = computed<ProfileItem[]>(() => {
  if (!props.user) return [];

  return [
    {
      key: "avatar",
      label: "Profile photo",
      complete: !!props.user.user_image,
      route: "/onboarding",
      weight: 15,
    },
    {
      key: "name",
      label: "Full name",
      complete: !!props.user.full_name && props.user.full_name.length > 1,
      route: "/onboarding",
      weight: 15,
    },
    {
      key: "email",
      label: "Email verified",
      complete: !!props.user.email && !props.user.email.includes("@budeglobal.local"),
      route: "/verify-email",
      weight: 20,
    },
    {
      key: "phone",
      label: "Phone number",
      complete: !!props.user.mobile_no,
      route: "/onboarding",
      weight: 15,
    },
    {
      key: "location",
      label: "Location added",
      complete: !!(props.user.profile?.city || props.user.location),
      route: "/onboarding",
      weight: 10,
    },
    {
      key: "bio",
      label: "Bio or headline",
      complete: !!(props.user.profile?.bio || props.user.profile?.headline || props.user.profile?.tagline),
      route: "/onboarding",
      weight: 10,
    },
    {
      key: "kyc",
      label: "KYC verified",
      complete: props.user.kyc_status === "Verified",
      route: "/kyc",
      weight: 15,
    },
  ];
});

const completedItems = computed(() =>
  profileItems.value.filter(item => item.complete)
);

const incompleteItems = computed(() =>
  profileItems.value.filter(item => !item.complete)
);

const completeness = computed(() => {
  if (!profileItems.value.length) return 0;
  const totalWeight = profileItems.value.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = completedItems.value.reduce((sum, item) => sum + item.weight, 0);
  return Math.round((completedWeight / totalWeight) * 100);
});

const progressColor = computed(() => {
  if (completeness.value < 40) return "bg-red-500";
  if (completeness.value < 70) return "bg-yellow-500";
  if (completeness.value < 100) return "bg-blue-500";
  return "bg-green-500";
});

const statusText = computed(() => {
  if (completeness.value === 100) return "Profile Complete!";
  if (completeness.value >= 70) return "Almost there!";
  if (completeness.value >= 40) return "Good progress";
  return "Let's get started";
});

function handleItemClick(item: ProfileItem) {
  if (!item.complete && item.route) {
    emit("navigate", item.route);
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">Profile Completeness</h3>
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold" :class="{
          'text-red-600': completeness < 40,
          'text-yellow-600': completeness >= 40 && completeness < 70,
          'text-blue-600': completeness >= 70 && completeness < 100,
          'text-green-600': completeness === 100,
        }">{{ completeness }}%</span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
      <div
        class="h-full transition-all duration-500 rounded-full"
        :class="progressColor"
        :style="{ width: `${completeness}%` }"
      ></div>
    </div>

    <p class="text-sm text-gray-600 mb-4">{{ statusText }}</p>

    <!-- Profile Items Checklist -->
    <ul class="space-y-2">
      <li
        v-for="item in profileItems"
        :key="item.key"
        class="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
        :class="{
          'bg-green-50': item.complete,
          'bg-gray-50 hover:bg-gray-100 cursor-pointer': !item.complete && item.route,
        }"
        @click="handleItemClick(item)"
      >
        <span class="flex items-center gap-3">
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center text-xs"
            :class="{
              'bg-green-500 text-white': item.complete,
              'bg-gray-300 text-gray-600': !item.complete,
            }"
          >
            {{ item.complete ? '✓' : '' }}
          </span>
          <span :class="item.complete ? 'text-green-700' : 'text-gray-700'">
            {{ item.label }}
          </span>
        </span>
        <button
          v-if="!item.complete && item.route"
          class="text-xs text-primary-600 font-medium hover:text-primary-700"
        >
          Add →
        </button>
      </li>
    </ul>

    <!-- Encouragement Message -->
    <div v-if="completeness < 100" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-700">
        <span class="font-medium">Tip:</span>
        {{ incompleteItems.length === 1
          ? `Complete your ${incompleteItems[0].label.toLowerCase()} to reach 100%!`
          : `Complete ${incompleteItems.length} more items to unlock all features.`
        }}
      </p>
    </div>

    <div v-else class="mt-4 p-3 bg-green-50 rounded-lg">
      <p class="text-sm text-green-700">
        <span class="font-medium">Congratulations!</span>
        Your profile is complete. You're now ready to make the most of the platform.
      </p>
    </div>
  </div>
</template>
