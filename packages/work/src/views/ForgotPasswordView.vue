<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@bude/shared";
import { isValidEmail } from "@bude/shared/utils";
import { Button } from "@bude/shared/components";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const submitted = ref(false);

async function handleSubmit() {
  if (!isValidEmail(email.value)) return;

  const result = await userStore.requestPasswordReset(email.value);
  if (result.success) {
    submitted.value = true;
  }
}
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
        <h1 class="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-500 mt-2">
          Enter your email to receive reset instructions
        </p>
      </div>

      <div class="card p-6">
        <div v-if="!submitted">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email Address</label
            >
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="input"
              @keyup.enter="handleSubmit"
            />
          </div>

          <p v-if="userStore.error" class="text-red-600 text-sm mb-4">
            {{ userStore.error }}
          </p>

          <Button
            :loading="userStore.isLoading"
            full-width
            @click="handleSubmit"
            >Send Reset Link</Button
          >

          <div class="mt-4 text-center">
            <router-link
              to="/login"
              class="text-sm text-primary-600 hover:underline"
              >Back to Login</router-link
            >
          </div>
        </div>

        <div v-else class="text-center">
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
          <h2 class="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p class="text-gray-500 mb-4">
            We've sent password reset instructions to {{ email }}
          </p>
          <router-link to="/login" class="text-primary-600 hover:underline"
            >Back to Login</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
