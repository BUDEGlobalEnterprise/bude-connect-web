/**
 * Wallet Store
 * Manages wallet balance, transactions, and unlock state
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WalletTransaction, ContactInfo } from '../types';
import * as walletApi from '../api/wallet';

interface UnlockedContact {
  doctype: 'Item' | 'Supplier';
  docname: string;
  contactInfo: ContactInfo;
}

export const useWalletStore = defineStore('wallet', () => {
  // State
  const balance = ref(0);
  const pendingCredits = ref(0);
  const isLoading = ref(false);
  const transactions = ref<WalletTransaction[]>([]);
  const unlockedContacts = ref<Map<string, ContactInfo>>(new Map());

  // Getters
  const hasCredits = computed(() => balance.value > 0);
  const totalCredits = computed(() => balance.value + pendingCredits.value);

  // Helper to create unlock key
  function getUnlockKey(doctype: string, docname: string): string {
    return `${doctype}:${docname}`;
  }

  // Check if contact is already unlocked (from local cache)
  function isUnlocked(doctype: 'Item' | 'Supplier', docname: string): boolean {
    return unlockedContacts.value.has(getUnlockKey(doctype, docname));
  }

  // Get cached contact info
  function getCachedContact(doctype: 'Item' | 'Supplier', docname: string): ContactInfo | null {
    return unlockedContacts.value.get(getUnlockKey(doctype, docname)) || null;
  }

  // Actions
  async function fetchBalance() {
    isLoading.value = true;
    try {
      const result = await walletApi.getBalance();
      balance.value = result.balance;
      pendingCredits.value = result.pending_credits;
    } finally {
      isLoading.value = false;
    }
  }

  async function unlockContact(
    doctype: 'Item' | 'Supplier',
    docname: string
  ): Promise<{ success: boolean; contactInfo?: ContactInfo; error?: string }> {
    // Check cache first
    const cached = getCachedContact(doctype, docname);
    if (cached) {
      return { success: true, contactInfo: cached };
    }

    isLoading.value = true;
    try {
      const result = await walletApi.unlockContact(doctype, docname);
      
      if (result.success && result.contact_info) {
        // Cache the unlocked contact
        unlockedContacts.value.set(
          getUnlockKey(doctype, docname),
          result.contact_info
        );
        
        // Update balance
        balance.value = result.new_balance;
        
        return { success: true, contactInfo: result.contact_info };
      }
      
      return { success: false, error: result.message || 'Unlock failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unlock failed' 
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTransactions(page = 1, pageSize = 20) {
    isLoading.value = true;
    try {
      const result = await walletApi.getTransactions({ page, page_size: pageSize });
      if (page === 1) {
        transactions.value = result.transactions;
      } else {
        transactions.value.push(...result.transactions);
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadUnlockedContacts() {
    try {
      const result = await walletApi.getUnlockedContacts();
      result.unlocks.forEach((unlock) => {
        unlockedContacts.value.set(
          getUnlockKey(unlock.doctype, unlock.docname),
          unlock.contact_info
        );
      });
    } catch (error) {
      console.error('Failed to load unlocked contacts:', error);
    }
  }

  function reset() {
    balance.value = 0;
    pendingCredits.value = 0;
    transactions.value = [];
    unlockedContacts.value.clear();
  }

  return {
    // State
    balance,
    pendingCredits,
    isLoading,
    transactions,
    
    // Getters
    hasCredits,
    totalCredits,
    
    // Helpers
    isUnlocked,
    getCachedContact,
    
    // Actions
    fetchBalance,
    unlockContact,
    fetchTransactions,
    loadUnlockedContacts,
    reset,
  };
});
