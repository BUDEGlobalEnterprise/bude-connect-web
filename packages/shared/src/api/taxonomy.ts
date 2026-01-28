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

export interface TaxonomyAttribute {
  id: string;
  name: string;
  handle: string;
  description: string;
  extended: boolean;
  values?: string[];
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
  attributes?: TaxonomyAttribute[];
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

// ── Attributes Loading (from split JSON files) ──────────────────────

/** Type for attribute with values */
interface AttributeWithValues {
  id: string;
  name: string;
  handle: string;
  description: string;
  values: { name: string; handle: string }[];
}

/** Cache for category-to-attributes mapping */
let categoryAttrMapCache: Record<string, string[]> | null = null;
let categoryAttrMapPromise: Promise<void> | null = null;

/** Cache for attribute index (handle -> file info) */
let attributeIndexCache: Record<string, { file: string; id: string }> | null = null;
let attributeIndexPromise: Promise<void> | null = null;

/** Cache for loaded attribute definitions (by file) */
const attributeFileCache = new Map<string, Map<string, AttributeWithValues>>();
const attributeFilePromises = new Map<string, Promise<void>>();

// Vite glob for lazy-loading attribute files
const attributeModules = import.meta.glob<{ attributes: AttributeWithValues[] }>(
  '../data/taxonomy/attributes/*-attributes.json',
  { import: 'default', eager: false }
);

const categoryMapModule = import.meta.glob<Record<string, string[]>>(
  '../data/taxonomy/attributes/category-attributes-map.json',
  { import: 'default', eager: false }
);

const attributeIndexModule = import.meta.glob<Record<string, { file: string; id: string }>>(
  '../data/taxonomy/attributes/attribute-index.json',
  { import: 'default', eager: false }
);

/**
 * Load category-to-attributes mapping (lazy, cached)
 */
async function loadCategoryAttrMap(): Promise<Record<string, string[]>> {
  if (categoryAttrMapCache) return categoryAttrMapCache;
  if (categoryAttrMapPromise) {
    await categoryAttrMapPromise;
    return categoryAttrMapCache!;
  }

  categoryAttrMapPromise = (async () => {
    try {
      const path = '../data/taxonomy/attributes/category-attributes-map.json';
      const loader = categoryMapModule[path];
      if (loader) {
        const data = await loader();
        categoryAttrMapCache = (data as any).default ?? data;
      } else {
        categoryAttrMapCache = {};
      }
    } catch (error) {
      console.error('Failed to load category-attributes map:', error);
      categoryAttrMapCache = {};
    }
  })();

  await categoryAttrMapPromise;
  return categoryAttrMapCache!;
}

/**
 * Load attribute index (lazy, cached)
 */
async function loadAttributeIndex(): Promise<Record<string, { file: string; id: string }>> {
  if (attributeIndexCache) return attributeIndexCache;
  if (attributeIndexPromise) {
    await attributeIndexPromise;
    return attributeIndexCache!;
  }

  attributeIndexPromise = (async () => {
    try {
      const path = '../data/taxonomy/attributes/attribute-index.json';
      const loader = attributeIndexModule[path];
      if (loader) {
        const data = await loader();
        attributeIndexCache = (data as any).default ?? data;
      } else {
        attributeIndexCache = {};
      }
    } catch (error) {
      console.error('Failed to load attribute index:', error);
      attributeIndexCache = {};
    }
  })();

  await attributeIndexPromise;
  return attributeIndexCache!;
}

/**
 * Load attribute definitions from a specific file (lazy, cached)
 */
async function loadAttributeFile(filename: string): Promise<Map<string, AttributeWithValues>> {
  if (attributeFileCache.has(filename)) {
    return attributeFileCache.get(filename)!;
  }

  if (attributeFilePromises.has(filename)) {
    await attributeFilePromises.get(filename);
    return attributeFileCache.get(filename)!;
  }

  const promise = (async () => {
    try {
      const path = `../data/taxonomy/attributes/${filename}`;
      const loader = attributeModules[path];
      if (loader) {
        const data = await loader();
        const attrs = (data as any).default?.attributes ?? (data as any).attributes ?? [];
        const map = new Map<string, AttributeWithValues>();
        for (const attr of attrs) {
          map.set(attr.handle, attr);
        }
        attributeFileCache.set(filename, map);
      } else {
        attributeFileCache.set(filename, new Map());
      }
    } catch (error) {
      console.error(`Failed to load attribute file ${filename}:`, error);
      attributeFileCache.set(filename, new Map());
    }
  })();

  attributeFilePromises.set(filename, promise);
  await promise;
  return attributeFileCache.get(filename)!;
}

/**
 * Get attributes for a specific category
 * Uses split files for efficient loading - only loads the files needed
 */
export async function getCategoryAttributes(categoryId: string): Promise<TaxonomyAttribute[]> {
  // Load the category-to-handles mapping
  const categoryMap = await loadCategoryAttrMap();
  const handles = categoryMap[categoryId];

  if (!handles || handles.length === 0) {
    return [];
  }

  // Load the attribute index to find which files contain these attributes
  const index = await loadAttributeIndex();

  // Group handles by file for efficient loading
  const handlesByFile = new Map<string, string[]>();
  for (const handle of handles) {
    const info = index[handle];
    if (info) {
      if (!handlesByFile.has(info.file)) {
        handlesByFile.set(info.file, []);
      }
      handlesByFile.get(info.file)!.push(handle);
    }
  }

  // Load all needed files in parallel
  const filesToLoad = Array.from(handlesByFile.keys());
  await Promise.all(filesToLoad.map(loadAttributeFile));

  // Collect the attributes in order
  const attributes: TaxonomyAttribute[] = [];
  for (const handle of handles) {
    const info = index[handle];
    if (info) {
      const fileCache = attributeFileCache.get(info.file);
      const attr = fileCache?.get(handle);
      if (attr) {
        attributes.push({
          id: attr.id,
          name: attr.name,
          handle: attr.handle,
          description: attr.description,
          extended: false,
          values: attr.values?.map(v => v.name) ?? []
        });
      }
    }
  }

  return attributes;
}

/**
 * Get category with attributes
 */
export async function getCategoryWithAttributes(categoryId: string): Promise<TaxonomyCategory | null> {
  const category = await getTaxonomyCategory(categoryId);
  if (!category) return null;

  const attributes = await getCategoryAttributes(categoryId);
  return { ...category, attributes };
}

/**
 * Get all available attributes (loads all attribute files)
 * Use sparingly - prefer getCategoryAttributes for specific categories
 */
export async function getAllAttributes(): Promise<TaxonomyAttribute[]> {
  const index = await loadAttributeIndex();
  const files = new Set(Object.values(index).map(info => info.file));

  // Load all files
  await Promise.all(Array.from(files).map(loadAttributeFile));

  // Collect all attributes
  const allAttrs: TaxonomyAttribute[] = [];
  for (const [, fileCache] of attributeFileCache) {
    for (const [, attr] of fileCache) {
      allAttrs.push({
        id: attr.id,
        name: attr.name,
        handle: attr.handle,
        description: attr.description,
        extended: false,
        values: attr.values?.map(v => v.name) ?? []
      });
    }
  }

  return allAttrs;
}
