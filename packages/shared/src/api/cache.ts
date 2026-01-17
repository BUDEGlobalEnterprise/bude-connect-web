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
