/**
 * Marketplace API
 * Handles goods marketplace operations
 */

import { frappe } from './client';
import type { MarketItem, MarketItemDetail, PaginatedResponse, SellerInfo } from '../types';

export interface FeedParams {
  category?: string;
  listing_type?: 'Sell' | 'Rent' | 'Surplus' | 'Scrap';
  condition?: string;
  min_price?: number;
  max_price?: number;
  lat?: number;
  long?: number;
  radius?: number;
  page?: number;
  page_size?: number;
  search?: string;
}

/**
 * Get marketplace feed with geo-sorting
 */
export async function getFeed(params: FeedParams = {}): Promise<PaginatedResponse<MarketItem>> {
  return frappe.call<PaginatedResponse<MarketItem>>('bude_core.market.get_feed', params);
}

/**
 * Get single item detail (contact hidden unless unlocked)
 */
export async function getItem(itemCode: string): Promise<MarketItemDetail> {
  return frappe.call<MarketItemDetail>('bude_core.market.get_item', { item_code: itemCode });
}

/**
 * Get categories (Item Groups)
 */
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  return frappe.call('bude_core.market.get_categories');
}

/**
 * Create draft listing
 */
export async function createDraftItem(data: {
  item_name: string;
  item_group: string;
  description: string;
  images: string[];
  condition: string;
}): Promise<{ item_code: string }> {
  return frappe.call('bude_core.market.create_draft_item', data);
}

/**
 * Publish listing (moves from Draft to Published)
 */
export async function publishItem(data: {
  item_code: string;
  standard_rate: number;
  listing_type: 'Sell' | 'Rent' | 'Surplus' | 'Scrap';
  location_geo?: { latitude: number; longitude: number };
  min_order_qty?: number;
}): Promise<MarketItem> {
  return frappe.call<MarketItem>('bude_core.market.publish_item', data);
}

/**
 * Update existing listing
 */
export async function updateItem(itemCode: string, data: Partial<MarketItem>): Promise<MarketItem> {
  return frappe.call<MarketItem>('bude_core.market.update_item', { 
    item_code: itemCode, 
    ...data 
  });
}

/**
 * Mark item as sold
 */
export async function markAsSold(itemCode: string): Promise<{ success: boolean }> {
  return frappe.call('bude_core.market.mark_as_sold', { item_code: itemCode });
}

/**
 * Get user's own listings
 */
export async function getMyListings(params: {
  status?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<MarketItem>> {
  return frappe.call<PaginatedResponse<MarketItem>>('bude_core.market.get_my_listings', params);
}

/**
 * Get seller info
 */
export async function getSellerInfo(userId: string): Promise<SellerInfo> {
  return frappe.call<SellerInfo>('bude_core.market.get_seller_info', { user_id: userId });
}

/**
 * Boost listing (premium feature)
 */
export async function boostListing(itemCode: string, days: number): Promise<{ 
  success: boolean; 
  credits_used: number;
  boost_expires: string;
}> {
  return frappe.call('bude_core.market.boost_listing', { item_code: itemCode, days });
}

/**
 * Upload item images
 */
export async function uploadItemImage(file: File): Promise<{ file_url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doctype', 'Item');
  formData.append('is_private', '0');

  const response = await fetch('/api/method/upload_file', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const result = await response.json();
  return { file_url: result.message.file_url };
}
