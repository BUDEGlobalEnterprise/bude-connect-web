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
  contact: {
    phone?: string;
    email?: string;
    name?: string;
  };
}

export const useWalletStore = defineStore('wallet', () => {
  // State
  const balance = ref(0);
  const isLoading = ref(false);
  const transactions = ref<WalletTransaction[]>([]);
  const unlockedContacts = ref<Map<string, ContactInfo>>(new Map());

  // Getters
  const hasCredits = computed(() => balance.value > 0);

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
      balance.value = result.credits;
    } finally {
      isLoading.value = false;
    }
  }

  async function unlockContact(
    doctype: 'Item' | 'Supplier',
    docname: string
  ): Promise<{ success: boolean; contact?: ContactInfo; error?: string }> {
    // Check cache first
    const cached = getCachedContact(doctype, docname);
    if (cached) {
      return { success: true, contact: cached };
    }

    // Check localStorage cache
    const localCached = walletApi.getCachedUnlock(doctype, docname);
    if (localCached?.contact) {
      const contact: ContactInfo = {
        phone: localCached.contact.phone,
        email: localCached.contact.email,
      };
      unlockedContacts.value.set(getUnlockKey(doctype, docname), contact);
      return { success: true, contact };
    }

    isLoading.value = true;
    try {
      const result = await walletApi.unlockContact(doctype, docname);
      
      if (result.success && result.contact) {
        const contact: ContactInfo = {
          phone: result.contact.phone,
          email: result.contact.email,
        };
        
        // Cache the unlocked contact in memory
        unlockedContacts.value.set(getUnlockKey(doctype, docname), contact);
        
        // Cache in localStorage
        walletApi.cacheUnlock(doctype, docname, result);
        
        // Update balance (deduct credits if not already unlocked)
        if (!result.already_unlocked) {
          balance.value = Math.max(0, balance.value - result.credits_used);
        }
        
        return { success: true, contact };
      }
      
      return { success: false, error: 'Unlock failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unlock failed' 
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTransactions(page = 0, pageSize = 20) {
    isLoading.value = true;
    try {
      const result = await walletApi.getTransactions({ page, page_size: pageSize });
      const data = Array.isArray(result.data) ? result.data : [];
      if (page === 0) {
        transactions.value = data;
      } else {
        transactions.value.push(...data);
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadUnlockedContacts() {
    try {
      const result = await walletApi.getUnlockedContacts();
      // Handle various response formats:
      // - PaginatedResponse: { data: [...], total, page, ... }
      // - Direct array: [...]
      // - Nested: { data: { data: [...] } }
      let data: typeof result.data = [];
      if (Array.isArray(result)) {
        data = result;
      } else if (result && typeof result === 'object') {
        if (Array.isArray(result.data)) {
          data = result.data;
        } else if (result.data && Array.isArray((result.data as any).data)) {
          data = (result.data as any).data;
        }
      }

      for (const unlock of data) {
        if (unlock && unlock.contact) {
          const contact: ContactInfo = {
            phone: unlock.contact.phone,
            email: unlock.contact.email,
          };
          unlockedContacts.value.set(
            getUnlockKey(unlock.doctype, unlock.docname),
            contact
          );
        }
      }
    } catch (error) {
      console.error('Failed to load unlocked contacts:', error);
    }
  }

  function reset() {
    balance.value = 0;
    transactions.value = [];
    unlockedContacts.value.clear();
    walletApi.clearUnlockCache();
  }

  return {
    // State
    balance,
    isLoading,
    transactions,
    
    // Getters
    hasCredits,
    
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
