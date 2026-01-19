<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@bude/shared";
import { Button, LoadingSkeleton } from "@bude/shared/components";
import { frappe } from "@bude/shared/api/client";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isLoading = ref(true);
const isVerified = ref(false);
const error = ref("");

async function verifyEmail() {
  const token = route.query.token as string;

  if (!token) {
    error.value = "Invalid verification link. Please request a new one.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await frappe.call<{
      success: boolean;
      user?: any;
      message?: string;
    }>("bude_core.auth.verify_email", { token });

    if (response.success) {
      isVerified.value = true;
      // Refresh user state
      await userStore.fetchCurrentUser();
    } else {
      error.value = response.message || "Verification failed. The link may have expired.";
    }
  } catch (e: any) {
    error.value = e.message || "Verification failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  verifyEmail();
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50"
  >
    <div class="max-w-md w-full text-center">
      <div class="card p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <LoadingSkeleton height="4rem" />
          <LoadingSkeleton height="2rem" />
          <LoadingSkeleton height="1rem" />
        </div>

        <!-- Success State -->
        <div v-else-if="isVerified">
          <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p class="text-gray-600 mb-6">
            Your email has been verified successfully. You can now enjoy full access to all features.
          </p>
          <Button @click="router.push('/')" full-width>
            Go to Home
          </Button>
        </div>

        <!-- Error State -->
        <div v-else>
          <div
            class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-10 h-10 text-red-600"
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
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p class="text-gray-600 mb-6">
            {{ error }}
          </p>
          <div class="space-y-3">
            <Button @click="router.push('/login')" full-width variant="ghost">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
