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
    const error = await response.json();
    throw new ApiError(error.message || 'Invalid credentials', response.status);
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
    throw new ApiError('Failed to get OAuth URL', response.status);
  }

  const data = await response.json();
  return data.message;
}

/**
 * Handle OAuth callback - exchange code for session
 */
export async function handleOAuthCallback(code: string, state: string): Promise<LoginResponse> {
  const response = await fetch(
    '/api/method/frappe.integrations.oauth2_logins.login_via_oauth2',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, state, provider: 'google' }),
    }
  );

  if (!response.ok) {
    throw new ApiError('OAuth login failed', response.status);
  }

  frappe.clearCsrfToken();
  return response.json();
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
    // First check if logged in
    const loggedUser = await frappe.call<string>('frappe.auth.get_logged_user');
    if (!loggedUser || loggedUser === 'Guest') {
      return null;
    }
    // Then get full user details
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
  await fetch('/api/method/logout', {
    method: 'POST',
    credentials: 'include',
  });
  frappe.clearCsrfToken();
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  return frappe.call<User>('bude_core.auth.update_profile', data);
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return frappe.call<{ message: string }>('frappe.core.doctype.user.user.reset_password', { user: email });
}
