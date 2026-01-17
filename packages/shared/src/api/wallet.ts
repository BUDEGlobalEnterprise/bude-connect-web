/**
 * Wallet API
 * Handles credit system and contact unlocking
 */

import { frappe } from './client';
import type { WalletTransaction, ContactInfo } from '../types';

export interface WalletBalance {
  balance: number;
  pending_credits: number;
}

export interface UnlockResult {
  success: boolean;
  already_unlocked: boolean;
  contact_info?: ContactInfo;
  credits_used: number;
  new_balance: number;
  message?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount_percent?: number;
}

/**
 * Get current wallet balance
 */
export async function getBalance(): Promise<WalletBalance> {
  return frappe.call<WalletBalance>('bude_core.wallet.get_balance');
}

/**
 * Unlock contact (costs 1 credit)
 * - Idempotent: returns cached if already unlocked
 * - Prevents self-unlock
 */
export async function unlockContact(
  doctype: 'Item' | 'Supplier',
  docname: string
): Promise<UnlockResult> {
  return frappe.call<UnlockResult>('bude_core.wallet.unlock_contact', {
    doctype,
    docname,
  });
}

/**
 * Check if contact is already unlocked
 */
export async function isContactUnlocked(
  doctype: 'Item' | 'Supplier',
  docname: string
): Promise<{ unlocked: boolean; contact_info?: ContactInfo }> {
  return frappe.call('bude_core.wallet.is_unlocked', { doctype, docname });
}

/**
 * Get transaction history
 */
export async function getTransactions(params: {
  transaction_type?: 'Credit' | 'Debit';
  page?: number;
  page_size?: number;
} = {}): Promise<{
  transactions: WalletTransaction[];
  total: number;
}> {
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
 * Returns payment gateway redirect URL
 */
export async function purchaseCredits(packageId: string): Promise<{
  order_id: string;
  payment_url: string;
}> {
  return frappe.call('bude_core.wallet.purchase_credits', { package_id: packageId });
}

/**
 * Verify payment and add credits (called after payment callback)
 */
export async function verifyPayment(orderId: string, paymentId: string): Promise<{
  success: boolean;
  credits_added: number;
  new_balance: number;
}> {
  return frappe.call('bude_core.wallet.verify_payment', { 
    order_id: orderId, 
    payment_id: paymentId 
  });
}

/**
 * Get all unlocked contacts
 */
export async function getUnlockedContacts(params: {
  doctype?: 'Item' | 'Supplier';
  page?: number;
} = {}): Promise<{
  unlocks: Array<{
    doctype: string;
    docname: string;
    contact_info: ContactInfo;
    unlocked_at: string;
  }>;
  total: number;
}> {
  return frappe.call('bude_core.wallet.get_unlocked_contacts', params);
}
