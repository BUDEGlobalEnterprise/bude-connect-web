/**
 * API Response Cache
 * In-memory cache with TTL support for reducing API calls
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;

  constructor(defaultTTL = 60000) {
    this.defaultTTL = defaultTTL;
  }

  /**
   * Generate cache key from method and params
   */
  private generateKey(method: string, params?: Record<string, unknown>): string {
    const paramStr = params ? JSON.stringify(params, Object.keys(params).sort()) : '';
    return `${method}:${paramStr}`;
  }

  /**
   * Get cached data if valid
   */
  get<T>(method: string, params?: Record<string, unknown>): T | null {
    const key = this.generateKey(method, params);
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store data in cache
   */
  set<T>(method: string, params: Record<string, unknown> | undefined, data: T, ttl?: number): void {
    const key = this.generateKey(method, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const apiCache = new ApiCache();

// ============ TTL Constants ============

/** 15 minutes - for semi-static data like categories, skills */
export const TTL_15_MIN = 15 * 60 * 1000;

/** 30 minutes - for static data like taxonomy verticals */
export const TTL_30_MIN = 30 * 60 * 1000;

/** 5 minutes - for frequently changing data */
export const TTL_5_MIN = 5 * 60 * 1000;

/** 1 hour - for very static data */
export const TTL_1_HOUR = 60 * 60 * 1000;

/**
 * HOF to wrap API calls with caching
 */
export function withCache<T, P extends Record<string, unknown>>(
  fn: (params?: P) => Promise<T>,
  methodName: string,
  ttl?: number
): (params?: P, forceRefresh?: boolean) => Promise<T> {
  return async (params?: P, forceRefresh = false): Promise<T> => {
    if (!forceRefresh) {
      const cached = apiCache.get<T>(methodName, params);
      if (cached !== null) {
        return cached;
      }
    }

    const result = await fn(params);
    apiCache.set(methodName, params, result, ttl);
    return result;
  };
}

/**
 * Request deduplication
 * Prevents multiple identical requests from firing simultaneously
 */
const pendingRequests = new Map<string, Promise<unknown>>();

export function deduplicateRequest<T>(
  key: string,
  request: () => Promise<T>
): Promise<T> {
  const existing = pendingRequests.get(key) as Promise<T> | undefined;
  if (existing) {
    return existing;
  }

  const promise = request().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// ============ Cached API Functions ============

import { frappe } from './client';
import type { Skill } from '../types';

/**
 * Get categories with 15 min cache
 */
export async function getCategoriesCached(forceRefresh = false): Promise<{ name: string; count: number }[]> {
  const cacheKey = 'market:categories';

  if (!forceRefresh) {
    const cached = apiCache.get<{ name: string; count: number }[]>(cacheKey);
    if (cached) return cached;
  }

  return deduplicateRequest(cacheKey, async () => {
    const result = await frappe.call<{ name: string; count: number }[]>(
      'bude_core.market.get_categories',
      {},
      true
    );
    apiCache.set(cacheKey, undefined, result, TTL_15_MIN);
    return result;
  });
}

/**
 * Get skills with 15 min cache
 */
export async function getSkillsCached(forceRefresh = false): Promise<Skill[]> {
  const cacheKey = 'work:skills';

  if (!forceRefresh) {
    const cached = apiCache.get<Skill[]>(cacheKey);
    if (cached) return cached;
  }

  return deduplicateRequest(cacheKey, async () => {
    const result = await frappe.call<Skill[]>('bude_core.work.get_skills', {}, true);
    apiCache.set(cacheKey, undefined, result, TTL_15_MIN);
    return result;
  });
}

/**
 * Get item conditions (static data, 1 hour cache)
 */
export function getConditionsCached(): string[] {
  // This is static data, no API needed
  return ['New', 'Open Box', 'Refurbished', 'Used', 'For Parts'];
}

/**
 * Get listing types (static data, 1 hour cache)
 */
export function getListingTypesCached(): { value: string; label: string; icon: string }[] {
  return [
    { value: 'Sell', label: 'Sell', icon: '🤝' },
    { value: 'Rent', label: 'Rent', icon: '🔄' },
    { value: 'Surplus', label: 'Surplus', icon: '📦' },
    { value: 'Scrap', label: 'Scrap', icon: '♻️' },
  ];
}

/**
 * Prefetch common static data on app init
 * Call this on app mount to warm the cache
 */
export async function prefetchStaticData(): Promise<void> {
  await Promise.allSettled([
    getCategoriesCached(),
    getSkillsCached(),
  ]);
}

/**
 * Invalidate market-related cache
 * Call after creating/updating listings
 */
export function invalidateMarketCache(): void {
  apiCache.invalidate('market:');
}

/**
 * Invalidate work-related cache
 * Call after creating/updating jobs or profiles
 */
export function invalidateWorkCache(): void {
  apiCache.invalidate('work:');
}
