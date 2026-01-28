/**
 * Favorites Store
 * Manages user's saved/bookmarked items
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as favoritesApi from '../api/favorites';
import type { FavoriteItem } from '../api/favorites';

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favorites = ref<FavoriteItem[]>([]);
  const favoriteIds = ref<Set<string>>(new Set());
  const isLoading = ref(false);
  const total = ref(0);
  const initialized = ref(false);

  // Getters
  const count = computed(() => favoriteIds.value.size);

  /**
   * Check if a specific item is favorited
   */
  function isFavorited(referenceDoctype: string, referenceName: string): boolean {
    return favoriteIds.value.has(`${referenceDoctype}:${referenceName}`);
  }

  /**
   * Load favorite IDs for quick lookup (called on login)
   */
  async function loadFavoriteIds(referenceDoctype?: string) {
    try {
      const result = await favoritesApi.getFavoriteIds(referenceDoctype);
      // The backend returns a flat list; we store as "DocType:name" keys
      for (const id of result.ids) {
        favoriteIds.value.add(id);
      }
      initialized.value = true;
    } catch (error) {
      console.error('Failed to load favorite IDs:', error);
    }
  }

  /**
   * Load full favorites list (for FavoritesView)
   */
  async function loadFavorites(referenceDoctype?: string, page = 1) {
    isLoading.value = true;
    try {
      const result = await favoritesApi.getFavorites(referenceDoctype, page);
      if (page === 1) {
        favorites.value = result.favorites;
      } else {
        favorites.value = [...favorites.value, ...result.favorites];
      }
      total.value = result.total;
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Toggle favorite status
   */
  async function toggleFavorite(referenceDoctype: string, referenceName: string): Promise<boolean> {
    const key = `${referenceDoctype}:${referenceName}`;
    const wasFavorited = favoriteIds.value.has(key);

    // Optimistic update
    if (wasFavorited) {
      favoriteIds.value.delete(key);
      favorites.value = favorites.value.filter(
        f => !(f.reference_doctype === referenceDoctype && f.reference_name === referenceName)
      );
    } else {
      favoriteIds.value.add(key);
    }

    try {
      if (wasFavorited) {
        await favoritesApi.removeFavorite(referenceDoctype, referenceName);
      } else {
        await favoritesApi.addFavorite(referenceDoctype, referenceName);
      }
      return !wasFavorited;
    } catch (error) {
      // Revert on error
      if (wasFavorited) {
        favoriteIds.value.add(key);
      } else {
        favoriteIds.value.delete(key);
      }
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }

  /**
   * Clear all state (called on logout)
   */
  function $reset() {
    favorites.value = [];
    favoriteIds.value = new Set();
    total.value = 0;
    initialized.value = false;
    isLoading.value = false;
  }

  return {
    favorites,
    favoriteIds,
    isLoading,
    total,
    initialized,
    count,
    isFavorited,
    loadFavoriteIds,
    loadFavorites,
    toggleFavorite,
    $reset,
  };
});
