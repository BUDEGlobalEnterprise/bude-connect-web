/**
 * Wallet API
 * Placeholder - requires custom backend implementation
 * Credit system needs custom doctypes
 */

import { frappe } from './client';
import type { WalletTransaction, PaginatedResponse } from '../types';

export interface WalletBalance {
  credits: number;
  currency: string;
}

export interface CreditPackage {
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export interface UnlockResult {
  success: boolean;
  contact: {
    phone?: string;
    email?: string;
  };
  credits_used: number;
}

/**
 * Get wallet balance
 * Placeholder - needs custom Wallet doctype
 */
export async function getBalance(): Promise<WalletBalance> {
  // Return mock data until backend is implemented
  return { credits: 0, currency: 'INR' };
}

/**
 * Unlock contact
 * Placeholder - needs custom implementation
 */
export async function unlockContact(doctype: string, docname: string): Promise<UnlockResult> {
  console.warn('Unlock contact requires custom backend implementation');
  
  // For development: return the contact info directly
  try {
    if (doctype === 'User') {
      const user = await frappe.getDoc<any>('User', docname);
      return {
        success: true,
        contact: { email: user.email, phone: user.mobile_no },
        credits_used: 0,
      };
    }
    if (doctype === 'Supplier') {
      const supplier = await frappe.getDoc<any>('Supplier', docname);
      return {
        success: true,
        contact: { email: supplier.email_id, phone: supplier.mobile_no },
        credits_used: 0,
      };
    }
  } catch (e) {
    console.error('Failed to get contact:', e);
  }
  
  return { success: false, contact: {}, credits_used: 0 };
}

/**
 * Check if contact is unlocked
 */
export async function isUnlocked(doctype: string, docname: string): Promise<{ unlocked: boolean }> {
  // For development: always return true (no credit system yet)
  return { unlocked: true };
}

/**
 * Get transaction history
 */
export async function getTransactions(params: {
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<WalletTransaction>> {
  return { data: [], has_next: false, total_count: 0 };
}

/**
 * Get credit packages
 */
export async function getCreditPackages(): Promise<CreditPackage[]> {
  // Return sample packages
  return [
    { name: 'starter', credits: 10, price: 99 },
    { name: 'popular', credits: 50, price: 449, popular: true },
    { name: 'pro', credits: 100, price: 799 },
  ];
}

/**
 * Purchase credits
 */
export async function purchaseCredits(packageId: string): Promise<{ order_id: string; amount: number }> {
  console.warn('Credit purchase requires payment integration');
  return { order_id: '', amount: 0 };
}

/**
 * Verify payment
 */
export async function verifyPayment(orderId: string, paymentId: string, signature: string): Promise<{ success: boolean; new_balance: number }> {
  console.warn('Payment verification requires backend implementation');
  return { success: false, new_balance: 0 };
}

/**
 * Get unlocked contacts
 */
export async function getUnlockedContacts(params: {
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<{ doctype: string; docname: string; contact: { phone?: string; email?: string }; unlocked_at: string }>> {
  return { data: [], has_next: false, total_count: 0 };
}
