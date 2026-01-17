/**
 * User Store
 * Manages authentication state and user profile
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import * as authApi from '../api/auth';

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const otpSent = ref(false);
  const otpMobile = ref('');

  // Getters
  const isLoggedIn = computed(() => !!user.value);
  const isVerified = computed(() => user.value?.kyc_status === 'Verified');
  const displayName = computed(() => user.value?.full_name || user.value?.mobile_no || 'Guest');
  const roles = computed(() => user.value?.roles || []);
  
  const isMarketSeller = computed(() => roles.value.includes('Market Seller'));
  const isMarketBuyer = computed(() => roles.value.includes('Market Buyer'));
  const isServiceProvider = computed(() => roles.value.includes('Service Provider'));
  const isServiceBuyer = computed(() => roles.value.includes('Service Buyer'));

  // Actions
  async function sendOtp(mobile: string) {
    isLoading.value = true;
    try {
      const result = await authApi.sendOtp(mobile);
      if (result.success) {
        otpSent.value = true;
        otpMobile.value = mobile;
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function verifyOtp(otp: string) {
    isLoading.value = true;
    try {
      const result = await authApi.verifyOtp(otpMobile.value, otp);
      if (result.success && result.user) {
        user.value = result.user;
        otpSent.value = false;
        otpMobile.value = '';
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCurrentUser() {
    isLoading.value = true;
    try {
      user.value = await authApi.getCurrentUser();
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await authApi.logout();
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(data: Partial<User>) {
    isLoading.value = true;
    try {
      user.value = await authApi.updateProfile(data);
    } finally {
      isLoading.value = false;
    }
  }

  function resetOtp() {
    otpSent.value = false;
    otpMobile.value = '';
  }

  return {
    // State
    user,
    isLoading,
    otpSent,
    otpMobile,
    
    // Getters
    isLoggedIn,
    isVerified,
    displayName,
    roles,
    isMarketSeller,
    isMarketBuyer,
    isServiceProvider,
    isServiceBuyer,
    
    // Actions
    sendOtp,
    verifyOtp,
    fetchCurrentUser,
    logout,
    updateProfile,
    resetOtp,
  };
});
