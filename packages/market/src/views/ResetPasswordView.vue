<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button, Input, PasswordStrengthMeter } from "@bude/shared/components";
import * as authApi from "@bude/shared/api/auth";

const route = useRoute();
const router = useRouter();

const newPassword = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const error = ref("");
const success = ref(false);
const token = ref("");

const passwordsMatch = computed(() => {
  return newPassword.value && newPassword.value === confirmPassword.value;
});

const confirmError = computed(() => {
  if (confirmPassword.value && !passwordsMatch.value) {
    return "Passwords do not match";
  }
  return "";
});

const canSubmit = computed(() => {
  return (
    newPassword.value.length >= 8 &&
    passwordsMatch.value &&
    !isLoading.value
  );
});

async function handleSubmit() {
  if (!canSubmit.value) return;

  isLoading.value = true;
  error.value = "";

  try {
    await authApi.resetPassword(token.value, newPassword.value);
    success.value = true;
  } catch (e: any) {
    error.value = e.message || "Failed to reset password. The link may have expired.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  // Get token from URL query param
  token.value = (route.query.token as string) || (route.query.key as string) || "";

  if (!token.value) {
    error.value = "Invalid or missing reset link. Please request a new one.";
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-white font-bold text-2xl">B</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Create New Password</h1>
        <p class="text-gray-500 mt-2">
          Enter your new password below
        </p>
      </div>

      <div class="card p-6">
        <!-- Success State -->
        <div v-if="success" class="text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
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
          <h2 class="text-xl font-bold text-gray-900 mb-2">Password Reset!</h2>
          <p class="text-gray-500 mb-4">
            Your password has been reset successfully.
          </p>
          <Button @click="router.push('/login')" full-width>
            Go to Login
          </Button>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <Input
              v-model="newPassword"
              type="password"
              placeholder="Enter new password"
              :disabled="!token"
            />
            <PasswordStrengthMeter
              v-if="newPassword"
              :password="newPassword"
              class="mt-2"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              :error="confirmError"
              :disabled="!token"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm mb-4">
            {{ error }}
          </p>

          <Button
            type="submit"
            :loading="isLoading"
            :disabled="!canSubmit"
            full-width
          >
            Reset Password
          </Button>

          <div class="mt-4 text-center">
            <router-link
              to="/forgot-password"
              class="text-sm text-primary-600 hover:underline"
            >
              Request new reset link
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
