/**
 * Authentication API
 * Handles Frappe authentication: username/password, Google OAuth, and OTP
 */

import { frappe, ApiError } from './client';
import type { User } from '../types';

export interface LoginResponse {
  message: string;
  home_page?: string;
  full_name?: string;
}

export interface OAuthUrlResponse {
  url: string;
}

// ============ Username/Password Auth ============

/**
 * Login with username/email and password
 */
export async function loginWithCredentials(usr: string, pwd: string): Promise<LoginResponse> {
  const response = await fetch('/api/method/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ usr, pwd }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message || 'Invalid credentials');
  }

  // Refresh CSRF token after login
  frappe.clearCsrfToken();
  
  return response.json();
}

// ============ Google OAuth ============

/**
 * Get Google OAuth authorization URL
 */
export async function getGoogleAuthUrl(redirectUri?: string): Promise<string> {
  const params = new URLSearchParams({
    provider: 'google',
    redirect_to: redirectUri || window.location.origin + '/oauth/callback',
  });
  
  const response = await fetch(
    `/api/method/frappe.integrations.oauth2_logins.get_oauth2_authorize_url?${params}`,
    { credentials: 'include' }
  );

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to get OAuth URL');
  }

  const data = await response.json();
  return data.message;
}

/**
 * Handle OAuth callback - exchange code for session
 */
export async function handleOAuthCallback(code: string, state: string): Promise<LoginResponse> {
  const result = await frappe.request<LoginResponse>('/api/method/frappe.integrations.oauth2_logins.login_via_oauth2', {
    method: 'POST',
    body: { code, state, provider: 'google' }
  });

  frappe.clearCsrfToken();
  return result;
}

// ============ OTP Auth (Mobile) ============

export interface OtpResponse {
  success: boolean;
  message: string;
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
export async function verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; user?: User }> {
  const response = await frappe.call<{ success: boolean; user?: User }>('bude_core.auth.verify_otp', { mobile, otp });
  if (response.success) {
    frappe.clearCsrfToken();
  }
  return response;
}

// ============ Session Management ============

/**
 * Get current logged in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // First check if logged in (silent to prevent redirect loop on public pages)
    const loggedUser = await frappe.call<string>('frappe.auth.get_logged_user', {}, true);
    if (!loggedUser || loggedUser === 'Guest') {
      return null;
    }
    // Then get full user details from bude_core
    const user = await frappe.call<User>('bude_core.auth.get_current_user', {}, true);
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
  await frappe.request('/api/method/logout', {
    method: 'POST'
  });
  frappe.clearCsrfToken();
}

export interface UpdateProfileData {
  fullName?: string;
  location?: string; // Generic location for User.location
  headline?: string;
  bio?: string;
  city?: string; // Structured location
  state?: string;
  country?: string;
  pincode?: string;
  role?: "buyer" | "seller" | "freelancer" | "client" | "both";
  businessName?: string;
  gstNumber?: string;
  hourlyRate?: number;
  availability?: "available" | "busy" | "away" | "not_available";
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<User> {
  return frappe.call<User>('bude_core.profile.user_profile.update_profile', {
    full_name: data.fullName,
    location: data.location,
    headline: data.headline,
    bio: data.bio,
    city: data.city,
    state: data.state,
    country: data.country,
    pincode: data.pincode,
    role: data.role,
    business_name: data.businessName,
    gst_number: data.gstNumber,
    hourly_rate: data.hourlyRate,
    availability: data.availability,
  });
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return frappe.call<{ message: string }>('frappe.core.doctype.user.user.reset_password', { user: email });
}

/**
 * Request KYC verification
 */
export async function requestKyc(data: { id_type: string; id_number: string; id_image: string }): Promise<{ status: string; message: string }> {
  return frappe.call('bude_core.auth.request_kyc', data);
}

/**
 * Get KYC status
 */
export async function getKycStatus(): Promise<{
  status: string;
  verified: boolean;
  can_submit: boolean;
  details?: {
    id_type: string;
    status: string;
    rejection_reason?: string;
    creation: string;
  };
}> {
  return frappe.call('bude_core.auth.get_kyc_status', {}, true);
}

/**
 * Cancel pending KYC request
 */
export async function cancelKyc(): Promise<{ message: string }> {
  return frappe.call('bude_core.auth.cancel_kyc_request');
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return frappe.call('bude_core.auth.reset_password', { token, new_password: newPassword }, true);
}
