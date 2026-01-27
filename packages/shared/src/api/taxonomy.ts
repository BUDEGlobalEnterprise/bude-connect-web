/**
 * Taxonomy - Frontend-only implementation
 * Serves product categories from Shopify Product Taxonomy using static JSON files.
 * No backend/Frappe calls — all data loaded and processed client-side.
 */

import verticalsData from '../data/taxonomy/verticals.json';

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

// ── Internal: lazy-load per-vertical JSON via Vite glob ───────────────
const categoryModules = import.meta.glob<TaxonomyCategory[]>(
  '../data/taxonomy/categories/*.json',
  { import: 'default', eager: false }
);

/** Cached lookup maps keyed by vertical id */
const lookupCache = new Map<string, Map<string, TaxonomyCategory>>();

async function loadVerticalLookup(verticalId: string): Promise<Map<string, TaxonomyCategory>> {
  if (lookupCache.has(verticalId)) {
    return lookupCache.get(verticalId)!;
  }

  const path = `../data/taxonomy/categories/${verticalId}.json`;
  const loader = categoryModules[path];
  if (!loader) {
    return new Map();
  }

  const raw = await loader();
  // Vite glob may return the array directly or wrap in { default: ... }
  const categories: TaxonomyCategory[] = Array.isArray(raw) ? raw : (raw as any).default ?? [];

  const lookup = new Map<string, TaxonomyCategory>();
  for (const cat of categories) {
    lookup.set(cat.id, cat);
  }

  lookupCache.set(verticalId, lookup);
  return lookup;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Get all 26 top-level product verticals (sync data, async signature for compat)
 */
export async function getTaxonomyVerticals(): Promise<TaxonomyVertical[]> {
  return verticalsData as TaxonomyVertical[];
}

/**
 * Get direct children of a category
 */
export async function getTaxonomyChildren(parentId: string): Promise<TaxonomyCategory[]> {
  const verticalId = parentId.split('-')[0];
  const lookup = await loadVerticalLookup(verticalId);
  const parent = lookup.get(parentId);
  if (!parent) return [];

  return parent.children
    .map((childId) => lookup.get(childId))
    .filter((c): c is TaxonomyCategory => !!c)
    .map((c) => ({ ...c, has_children: c.children.length > 0 }));
}

/**
 * Get a single category with its breadcrumb path
 */
export async function getTaxonomyCategory(categoryId: string): Promise<TaxonomyCategory | null> {
  const verticalId = categoryId.split('-')[0];
  const lookup = await loadVerticalLookup(verticalId);
  const cat = lookup.get(categoryId);
  if (!cat) return null;

  // Walk up parent chain to build breadcrumb
  const breadcrumb: { id: string; name: string }[] = [];
  let current: TaxonomyCategory | undefined = cat;
  while (current) {
    breadcrumb.unshift({ id: current.id, name: current.name });
    current = current.parent_id ? lookup.get(current.parent_id) : undefined;
  }

  return { ...cat, has_children: cat.children.length > 0, breadcrumb };
}

/**
 * Search categories by name (loads all verticals in parallel on first search)
 */
export async function searchTaxonomy(query: string, limit = 10): Promise<TaxonomyCategory[]> {
  const lowerQuery = query.toLowerCase();
  const results: TaxonomyCategory[] = [];

  // Load all vertical lookups in parallel
  const allVerticals = verticalsData as TaxonomyVertical[];
  const lookups = await Promise.all(allVerticals.map((v) => loadVerticalLookup(v.id)));

  for (const lookup of lookups) {
    for (const cat of lookup.values()) {
      if (cat.name.toLowerCase().includes(lowerQuery)) {
        results.push({ ...cat, has_children: cat.children.length > 0 });
        if (results.length >= limit) return results;
      }
    }
  }

  return results;
}
