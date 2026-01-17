/**
 * Wallet/Credits API
 * Handles credit system - balance, transactions, contact unlocking
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
    name?: string;
  };
  credits_used: number;
  already_unlocked?: boolean;
}

/**
 * Get wallet balance
 */
export async function getBalance(): Promise<WalletBalance> {
  return frappe.call<WalletBalance>('bude_core.wallet.get_balance');
}

/**
 * Unlock contact (idempotent - safe to call multiple times)
 * Returns contact info and deducts credits (only first time)
 */
export async function unlockContact(doctype: string, docname: string): Promise<UnlockResult> {
  return frappe.call<UnlockResult>('bude_core.wallet.unlock_contact', {
    doctype,
    docname,
  });
}

/**
 * Check if contact is already unlocked
 */
export async function isUnlocked(doctype: string, docname: string): Promise<{ unlocked: boolean }> {
  return frappe.call('bude_core.wallet.is_unlocked', { doctype, docname });
}

/**
 * Get transaction history
 */
export async function getTransactions(params: {
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<WalletTransaction>> {
  return frappe.call('bude_core.wallet.get_transactions', params);
}

/**
 * Get available credit packages
 */
export async function getCreditPackages(): Promise<CreditPackage[]> {
  return frappe.call<CreditPackage[]>('bude_core.wallet.get_credit_packages');
}

/**
 * Initiate credit purchase
 */
export async function purchaseCredits(packageId: string): Promise<{ order_id: string; amount: number }> {
  return frappe.call('bude_core.wallet.purchase_credits', { package_id: packageId });
}

/**
 * Verify payment after completion
 */
export async function verifyPayment(orderId: string, paymentId: string, signature: string): Promise<{ 
  success: boolean; 
  new_balance: number; 
}> {
  return frappe.call('bude_core.wallet.verify_payment', { 
    order_id: orderId, 
    payment_id: paymentId, 
    signature 
  });
}

/**
 * Get list of unlocked contacts
 */
export async function getUnlockedContacts(params: {
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<{
  doctype: string;
  docname: string;
  contact: { phone?: string; email?: string; name?: string };
  unlocked_at: string;
}>> {
  return frappe.call('bude_core.wallet.get_unlocked_contacts', params);
}

// ============ Local Cache Helpers ============

const UNLOCK_CACHE_KEY = 'bude_unlocked_contacts';

/**
 * Check cache for unlocked contact
 */
export function getCachedUnlock(doctype: string, docname: string): UnlockResult | null {
  try {
    const cache = JSON.parse(localStorage.getItem(UNLOCK_CACHE_KEY) || '{}');
    const key = `${doctype}:${docname}`;
    return cache[key] || null;
  } catch {
    return null;
  }
}

/**
 * Cache unlocked contact locally
 */
export function cacheUnlock(doctype: string, docname: string, result: UnlockResult): void {
  try {
    const cache = JSON.parse(localStorage.getItem(UNLOCK_CACHE_KEY) || '{}');
    const key = `${doctype}:${docname}`;
    cache[key] = result;
    localStorage.setItem(UNLOCK_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
}

/**
 * Clear unlock cache (on logout)
 */
export function clearUnlockCache(): void {
  try {
    localStorage.removeItem(UNLOCK_CACHE_KEY);
  } catch {
    // Ignore
  }
}
