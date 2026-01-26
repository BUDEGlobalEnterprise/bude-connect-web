/**
 * Marketplace API
 * Handles goods marketplace operations
 */

import { frappe } from './client';
import type { MarketItem, MarketItemDetail, PaginatedResponse, SellerInfo } from '../types';

export interface FeedParams {
  [key: string]: any;
  category?: string;
  listingType?: 'Sell' | 'Rent' | 'Surplus' | 'Scrap';
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  long?: number;
  radius?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}

/**
 * Get marketplace feed with geo-sorting
 */
export async function getFeed(params: FeedParams = {}): Promise<PaginatedResponse<MarketItem>> {
  return frappe.call<PaginatedResponse<MarketItem>>('bude_core.market.get_feed', {
    category: params.category,
    listing_type: params.listingType,
    condition: params.condition,
    min_price: params.minPrice,
    max_price: params.maxPrice,
    lat: params.lat,
    long: params.long,
    radius: params.radius,
    page: params.page,
    page_size: params.pageSize,
    search: params.search
  }, true);
}

/**
 * Get single item detail (contact hidden unless unlocked)
 */
export async function getItem(itemCode: string): Promise<MarketItemDetail> {
  return frappe.call<MarketItemDetail>('bude_core.market.get_item', { item_code: itemCode }, true);
}

/**
 * Get categories (Item Groups)
 */
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  return frappe.call<{ name: string; count: number }[]>('bude_core.market.get_categories', {}, true);
}

/**
 * Create draft listing
 */
export async function createDraftItem(data: {
  itemName: string;
  itemGroup: string;
  description: string;
  images: string[];
  condition: string;
}): Promise<{ itemCode: string }> {
  return frappe.call('bude_core.market.create_draft_item', {
    item_name: data.itemName,
    item_group: data.itemGroup,
    description: data.description,
    images: data.images,
    condition: data.condition
  });
}

/**
 * Publish listing (moves from Draft to Published)
 */
export async function publishItem(data: {
  itemCode: string;
  standardRate: number;
  listingType: 'Sell' | 'Rent' | 'Surplus' | 'Scrap';
  locationGeo?: { latitude: number; longitude: number };
  minOrderQty?: number;
}): Promise<MarketItem> {
  return frappe.call<MarketItem>('bude_core.market.publish_item', {
    item_code: data.itemCode,
    standard_rate: data.standardRate,
    listing_type: data.listingType,
    location_geo: data.locationGeo,
    min_order_qty: data.minOrderQty
  });
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
  [key: string]: any;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PaginatedResponse<MarketItem>> {
  return frappe.call<PaginatedResponse<MarketItem>>('bude_core.market.get_my_listings', {
    status: params.status,
    page: params.page,
    page_size: params.pageSize
  });
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
  const fileUrl = await frappe.upload(file, {
    doctype: 'Item',
    isPrivate: false
  });
  
  return { file_url: fileUrl };
}
