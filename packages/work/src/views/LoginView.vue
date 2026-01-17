<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore, useWalletStore } from "@bude/shared";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const walletStore = useWalletStore();

const mobile = ref("");
const otp = ref("");
const error = ref("");

const isOtpSent = computed(() => userStore.otpSent);
const isLoading = computed(() => userStore.isLoading);

async function handleSendOtp() {
  if (!mobile.value || mobile.value.length < 10) {
    error.value = "Please enter a valid mobile number";
    return;
  }

  error.value = "";
  const result = await userStore.sendOtp(mobile.value);

  if (!result.success) {
    error.value = result.message || "Failed to send OTP";
  }
}

async function handleVerifyOtp() {
  if (!otp.value || otp.value.length < 4) {
    error.value = "Please enter a valid OTP";
    return;
  }

  error.value = "";
  const result = await userStore.verifyOtp(otp.value);

  if (result.success) {
    await walletStore.fetchBalance();
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } else {
    error.value = "Invalid OTP. Please try again.";
  }
}

function handleChangeNumber() {
  userStore.resetOtp();
  otp.value = "";
  error.value = "";
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-white font-bold text-2xl">B</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">
          Welcome to BudeGlobal Work
        </h1>
        <p class="text-gray-500 mt-2">Find talent or get hired</p>
      </div>

      <div class="card p-6">
        <div v-if="!isOtpSent">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Mobile Number</label
          >
          <div class="flex gap-2">
            <div
              class="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
            >
              +91
            </div>
            <input
              v-model="mobile"
              type="tel"
              maxlength="10"
              placeholder="Enter mobile number"
              class="input flex-1"
              @keyup.enter="handleSendOtp"
            />
          </div>
          <button
            @click="handleSendOtp"
            :disabled="isLoading"
            class="w-full btn btn-primary mt-4 py-3"
          >
            {{ isLoading ? "Sending OTP..." : "Send OTP" }}
          </button>
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700"
              >Enter OTP</label
            >
            <button
              @click="handleChangeNumber"
              class="text-sm text-primary-600 hover:underline"
            >
              Change number
            </button>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            OTP sent to +91 {{ userStore.otpMobile }}
          </p>
          <input
            v-model="otp"
            type="text"
            maxlength="6"
            placeholder="Enter 6-digit OTP"
            class="input text-center text-2xl tracking-widest"
            @keyup.enter="handleVerifyOtp"
          />
          <button
            @click="handleVerifyOtp"
            :disabled="isLoading"
            class="w-full btn btn-primary mt-4 py-3"
          >
            {{ isLoading ? "Verifying..." : "Verify & Login" }}
          </button>
          <button
            @click="handleSendOtp"
            :disabled="isLoading"
            class="w-full text-sm text-gray-600 hover:text-primary-600 mt-4"
          >
            Didn't receive OTP? Resend
          </button>
        </div>

        <p v-if="error" class="text-red-600 text-sm mt-4 text-center">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>
