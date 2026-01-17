/**
 * Authentication API
 * Handles OTP-based mobile login for Frappe backend
 */

import { frappe, ApiError } from './client';
import type { User } from '../types';

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  session_token?: string;
}

/**
 * Send OTP to mobile number
 */
export async function sendOtp(mobile: string): Promise<OtpResponse> {
  return frappe.call<OtpResponse>('bude_core.auth.send_otp', { mobile });
}

/**
 * Verify OTP and login
 */
export async function verifyOtp(mobile: string, otp: string): Promise<LoginResponse> {
  const response = await frappe.call<LoginResponse>('bude_core.auth.verify_otp', { 
    mobile, 
    otp 
  });
  return response;
}

/**
 * Get current logged in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await frappe.call<User>('bude_core.auth.get_current_user');
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      return null;
    }
    throw error;
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  await frappe.call('logout');
  frappe.clearCsrfToken();
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  return frappe.call<User>('bude_core.auth.update_profile', data);
}

/**
 * Request KYC verification
 */
export async function requestKycVerification(documents: {
  id_type: string;
  id_number: string;
  id_image: string;
}): Promise<{ status: string; message: string }> {
  return frappe.call('bude_core.auth.request_kyc', documents);
}
