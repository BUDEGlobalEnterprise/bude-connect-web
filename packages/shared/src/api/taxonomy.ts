/**
 * Taxonomy API
 * Serves product categories from Shopify Product Taxonomy (static JSON, no DB).
 */

import { frappe } from './client';

export interface TaxonomyVertical {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  full_name: string;
  level: number;
  parent_id: string | null;
  children: string[];
  has_children?: boolean;
  breadcrumb?: { id: string; name: string }[];
}

/**
 * Get all 26 top-level product verticals
 */
export async function getTaxonomyVerticals(): Promise<TaxonomyVertical[]> {
  return frappe.call<TaxonomyVertical[]>('bude_core.taxonomy.taxonomy_service.get_taxonomy_verticals');
}

/**
 * Get direct children of a category
 */
export async function getTaxonomyChildren(parentId: string): Promise<TaxonomyCategory[]> {
  return frappe.call<TaxonomyCategory[]>('bude_core.taxonomy.taxonomy_service.get_taxonomy_children', {
    parent_id: parentId,
  });
}

/**
 * Get a single category with breadcrumb path
 */
export async function getTaxonomyCategory(categoryId: string): Promise<TaxonomyCategory | null> {
  return frappe.call<TaxonomyCategory | null>('bude_core.taxonomy.taxonomy_service.get_taxonomy_category', {
    category_id: categoryId,
  });
}

/**
 * Search categories by name
 */
export async function searchTaxonomy(query: string, limit = 10): Promise<TaxonomyCategory[]> {
  return frappe.call<TaxonomyCategory[]>('bude_core.taxonomy.taxonomy_service.search_taxonomy', {
    query,
    limit,
  });
}
