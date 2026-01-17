/**
 * Authentication API
 * Uses standard Frappe/ERPNext authentication endpoints
 */

import { frappe, ApiError } from './client';
import type { User } from '../types';

export interface LoginResponse {
  message: string;
  home_page?: string;
  full_name?: string;
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

// ============ Session Management ============

/**
 * Get current logged in user - uses standard Frappe endpoint
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Standard Frappe endpoint to get logged user
    const loggedUser = await frappe.call<string>('frappe.auth.get_logged_user');
    if (!loggedUser || loggedUser === 'Guest') {
      return null;
    }
    
    // Get user details from User doctype
    const userDoc = await frappe.getDoc<User>('User', loggedUser);
    return {
      name: userDoc.name,
      email: userDoc.email,
      full_name: userDoc.full_name,
      user_image: userDoc.user_image,
      roles: userDoc.roles?.map((r: any) => r.role) || [],
    } as User;
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      return null;
    }
    // If any error, user is not logged in
    return null;
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
 * Update user profile - uses standard Frappe resource API
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await frappe.call<User>('frappe.client.set_value', {
    doctype: 'User',
    name: data.name,
    fieldname: data,
  });
  return response;
}

/**
 * Request password reset - standard Frappe endpoint
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return frappe.call<{ message: string }>('frappe.core.doctype.user.user.reset_password', { user: email });
}

// ============ OTP Auth (Optional - requires custom setup) ============

export interface OtpResponse {
  success: boolean;
  message: string;
}

/**
 * Send OTP to mobile number
 * Note: Requires custom backend implementation or frappe_whatsapp/frappe_sms app
 */
export async function sendOtp(mobile: string): Promise<OtpResponse> {
  // This would need a custom endpoint - for now return a placeholder
  console.warn('OTP login requires custom backend implementation');
  return { success: false, message: 'OTP login not configured' };
}

/**
 * Verify OTP and login
 */
export async function verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; user?: User }> {
  console.warn('OTP login requires custom backend implementation');
  return { success: false };
}
