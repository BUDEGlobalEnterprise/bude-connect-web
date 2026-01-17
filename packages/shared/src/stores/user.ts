/**
 * User Store
 * Manages authentication state and user profile
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import * as authApi from '../api/auth';

export type AuthMethod = 'credentials' | 'google' | 'otp' | null;

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const authMethod = ref<AuthMethod>(null);
  const error = ref<string | null>(null);
  
  // OTP-specific state
  const otpSent = ref(false);
  const otpMobile = ref('');

  // Getters
  const isLoggedIn = computed(() => !!user.value);
  const isVerified = computed(() => user.value?.kyc_status === 'Verified');
  const displayName = computed(() => user.value?.full_name || user.value?.email || user.value?.mobile_no || 'Guest');
  const roles = computed(() => user.value?.roles || []);
  
  const isMarketSeller = computed(() => roles.value.includes('Market Seller'));
  const isMarketBuyer = computed(() => roles.value.includes('Market Buyer'));
  const isServiceProvider = computed(() => roles.value.includes('Service Provider'));
  const isServiceBuyer = computed(() => roles.value.includes('Service Buyer'));

  // ============ Username/Password Login ============
  async function loginWithCredentials(usr: string, pwd: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await authApi.loginWithCredentials(usr, pwd);
      authMethod.value = 'credentials';
      await fetchCurrentUser();
      return { success: true };
    } catch (e: any) {
      error.value = e.message || 'Invalid credentials';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ============ Google OAuth ============
  async function initiateGoogleLogin(redirectUri?: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const url = await authApi.getGoogleAuthUrl(redirectUri);
      // Store intended redirect for after OAuth
      sessionStorage.setItem('oauth_redirect', window.location.pathname);
      window.location.href = url;
    } catch (e: any) {
      error.value = e.message || 'Failed to initiate Google login';
      isLoading.value = false;
    }
  }

  async function handleGoogleCallback(code: string, state: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await authApi.handleOAuthCallback(code, state);
      authMethod.value = 'google';
      await fetchCurrentUser();
      return { success: true };
    } catch (e: any) {
      error.value = e.message || 'OAuth login failed';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  // ============ OTP Login ============
  async function sendOtp(mobile: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await authApi.sendOtp(mobile);
      if (result.success) {
        otpSent.value = true;
        otpMobile.value = mobile;
      }
      return result;
    } catch (e: any) {
      error.value = e.message || 'Failed to send OTP';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  async function verifyOtp(otp: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await authApi.verifyOtp(otpMobile.value, otp);
      if (result.success && result.user) {
        user.value = result.user;
        authMethod.value = 'otp';
        otpSent.value = false;
        otpMobile.value = '';
      }
      return result;
    } catch (e: any) {
      error.value = e.message || 'Invalid OTP';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  function resetOtp() {
    otpSent.value = false;
    otpMobile.value = '';
    error.value = null;
  }

  // ============ Session Management ============
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
      authMethod.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(data: Partial<User>) {
    isLoading.value = true;
    error.value = null;
    try {
      user.value = await authApi.updateProfile(data);
      return { success: true };
    } catch (e: any) {
      error.value = e.message || 'Failed to update profile';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  async function requestPasswordReset(email: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await authApi.requestPasswordReset(email);
      return { success: true, message: 'Password reset link sent to your email' };
    } catch (e: any) {
      error.value = e.message || 'Failed to send reset link';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    user,
    isLoading,
    authMethod,
    error,
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
    loginWithCredentials,
    initiateGoogleLogin,
    handleGoogleCallback,
    sendOtp,
    verifyOtp,
    resetOtp,
    fetchCurrentUser,
    logout,
    updateProfile,
    requestPasswordReset,
    clearError,
  };
});
