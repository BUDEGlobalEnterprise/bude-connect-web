/**
 * Marketplace API
 * Uses standard ERPNext doctypes (Item, Customer, etc.)
 */

import { frappe } from './client';
import type { MarketItem, MarketItemDetail, PaginatedResponse, SellerInfo } from '../types';

export interface FeedParams {
  category?: string;
  listing_type?: 'Sell' | 'Rent' | 'Surplus' | 'Scrap';
  condition?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
  search?: string;
}

/**
 * Get marketplace feed - uses Item doctype with filters
 */
export async function getFeed(params: FeedParams = {}): Promise<PaginatedResponse<MarketItem>> {
  const filters: any = { disabled: 0 };
  
  if (params.category) filters.item_group = params.category;
  if (params.search) filters.item_name = ['like', `%${params.search}%`];
  
  const items = await frappe.getList<any>('Item', {
    fields: ['name', 'item_name', 'item_group', 'description', 'standard_rate', 'image'],
    filters,
    limit_start: (params.page || 0) * (params.page_size || 20),
    limit_page_length: params.page_size || 20,
  });

  return {
    data: items.map(item => ({
      name: item.name,
      item_name: item.item_name,
      item_group: item.item_group,
      description: item.description,
      price: item.standard_rate,
      image_url: item.image,
      listing_type: 'Sell',
      condition: 'New',
    })) as MarketItem[],
    has_next: items.length === (params.page_size || 20),
    total_count: items.length,
  };
}

/**
 * Get single item detail
 */
export async function getItem(itemCode: string): Promise<MarketItemDetail> {
  const item = await frappe.getDoc<any>('Item', itemCode);
  
  return {
    name: item.name,
    item_name: item.item_name,
    item_group: item.item_group,
    description: item.description,
    price: item.standard_rate,
    image_url: item.image,
    images: item.image ? [item.image] : [],
    listing_type: 'Sell',
    condition: 'New',
    seller: {
      name: item.owner,
      email: item.owner,
    },
  } as MarketItemDetail;
}

/**
 * Get categories (Item Groups)
 */
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const groups = await frappe.getList<{ name: string }>('Item Group', {
    fields: ['name'],
    filters: { is_group: 0 },
    limit_page_length: 100,
  });
  
  return groups.map(g => ({ name: g.name, count: 0 }));
}

/**
 * Create draft item
 */
export async function createDraftItem(data: {
  item_name: string;
  item_group: string;
  description: string;
  images: string[];
  condition: string;
}): Promise<{ item_code: string }> {
  const item = await frappe.createDoc<{ name: string }>('Item', {
    item_name: data.item_name,
    item_group: data.item_group,
    description: data.description,
    image: data.images[0] || '',
    is_stock_item: 0,
  });
  
  return { item_code: item.name };
}

/**
 * Publish listing
 */
export async function publishItem(data: {
  item_code: string;
  standard_rate: number;
  listing_type: string;
}): Promise<MarketItem> {
  const item = await frappe.updateDoc<any>('Item', data.item_code, {
    standard_rate: data.standard_rate,
    disabled: 0,
  });
  
  return {
    name: item.name,
    item_name: item.item_name,
    price: item.standard_rate,
  } as MarketItem;
}

/**
 * Update existing listing
 */
export async function updateItem(itemCode: string, data: Partial<MarketItem>): Promise<MarketItem> {
  const updateData: any = {};
  if (data.item_name) updateData.item_name = data.item_name;
  if (data.description) updateData.description = data.description;
  if (data.price) updateData.standard_rate = data.price;
  
  const item = await frappe.updateDoc<any>('Item', itemCode, updateData);
  return item as MarketItem;
}

/**
 * Mark item as sold (disable it)
 */
export async function markAsSold(itemCode: string): Promise<{ success: boolean }> {
  await frappe.updateDoc('Item', itemCode, { disabled: 1 });
  return { success: true };
}

/**
 * Get user's own listings
 */
export async function getMyListings(params: {
  status?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<PaginatedResponse<MarketItem>> {
  // This needs session user - will work after login
  const items = await frappe.getList<any>('Item', {
    fields: ['name', 'item_name', 'item_group', 'standard_rate', 'image', 'disabled'],
    filters: { owner: ['like', '%'] }, // Filter by owner once logged in
    limit_page_length: params.page_size || 20,
  });

  return {
    data: items as MarketItem[],
    has_next: false,
    total_count: items.length,
  };
}

/**
 * Get seller info
 */
export async function getSellerInfo(userId: string): Promise<SellerInfo> {
  const user = await frappe.getDoc<any>('User', userId);
  return {
    name: user.full_name,
    email: user.email,
    member_since: user.creation,
    is_verified: user.enabled === 1,
    listing_count: 0,
  };
}

/**
 * Boost listing (placeholder - needs custom implementation)
 */
export async function boostListing(itemCode: string, days: number): Promise<{ success: boolean; credits_used: number; boost_expires: string }> {
  console.warn('Boost listing requires custom backend implementation');
  return { success: false, credits_used: 0, boost_expires: '' };
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
