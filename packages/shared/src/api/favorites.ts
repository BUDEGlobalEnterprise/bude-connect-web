/**
 * Favorites API
 * Handles saving/removing items and jobs to user's favorites
 */

import { frappe } from './client';

export interface FavoriteItem {
  name: string;
  reference_doctype: 'Item' | 'Job Opening' | 'Supplier';
  reference_name: string;
  reference_title: string;
  reference_image?: string;
  reference_price?: number;
  reference_category?: string;
  creation: string;
}

export interface FavoritesResponse {
  favorites: FavoriteItem[];
  total: number;
}

/**
 * Add item to favorites
 */
export async function addFavorite(
  referenceDoctype: string,
  referenceName: string
): Promise<{ success: boolean; favorite_id: string }> {
  return frappe.call(
    'bude_core.favorites.favorite_handler.add_favorite',
    {
      reference_doctype: referenceDoctype,
      reference_name: referenceName,
    }
  );
}

/**
 * Remove item from favorites
 */
export async function removeFavorite(
  referenceDoctype: string,
  referenceName: string
): Promise<{ success: boolean }> {
  return frappe.call(
    'bude_core.favorites.favorite_handler.remove_favorite',
    {
      reference_doctype: referenceDoctype,
      reference_name: referenceName,
    }
  );
}

/**
 * Check if item is favorited
 */
export async function isFavorited(
  referenceDoctype: string,
  referenceName: string
): Promise<{ is_favorited: boolean }> {
  return frappe.call(
    'bude_core.favorites.favorite_handler.is_favorited',
    {
      reference_doctype: referenceDoctype,
      reference_name: referenceName,
    }
  );
}

/**
 * Get user's favorites list
 */
export async function getFavorites(
  referenceDoctype?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<FavoritesResponse> {
  return frappe.call<FavoritesResponse>(
    'bude_core.favorites.favorite_handler.get_favorites',
    {
      reference_doctype: referenceDoctype,
      page,
      page_size: pageSize,
    }
  );
}

/**
 * Get IDs of all favorited items (for quick lookup)
 */
export async function getFavoriteIds(
  referenceDoctype?: string
): Promise<{ ids: string[] }> {
  return frappe.call<{ ids: string[] }>(
    'bude_core.favorites.favorite_handler.get_favorite_ids',
    {
      reference_doctype: referenceDoctype,
    }
  );
}
