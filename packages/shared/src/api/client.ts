/**
 * Frappe API Client
 * Handles authentication, CSRF tokens, and API communication
 */

// Use empty string for relative paths - Vite proxy forwards /api/* to Frappe backend
const API_URL = '';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

class FrappeClient {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get CSRF token from cookie (set by Frappe on login)
   */
  private getCsrfToken(): string {
    if (this.csrfToken) return this.csrfToken;
    
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    this.csrfToken = match ? match[1] : '';
    return this.csrfToken;
  }

  /**
   * Clear cached CSRF token (call on logout)
   */
  clearCsrfToken(): void {
    this.csrfToken = null;
  }

  /**
   * Make API request to Frappe backend
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    };

    // Add CSRF token for non-GET requests
    if (method !== 'GET') {
      requestHeaders['X-Frappe-CSRF-Token'] = this.getCsrfToken();
    }

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      credentials: 'include', // Important for session cookies
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle session expiry (401/403)
    if (response.status === 401 || response.status === 403) {
      this.handleSessionExpiry();
      throw new ApiError(response.status, 'Session expired. Please log in again.', {});
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new ApiError(response.status, error.message || 'API request failed', error);
    }

    return response.json();
  }

  /**
   * Handle session expiry - redirect to login
   */
  private handleSessionExpiry(): void {
    // Clear cached token
    this.clearCsrfToken();

    // Show toast notification (if toast system available)
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'error',
        message: 'Your session has expired. Please log in again.',
        duration: 5000,
      });
    }

    // Redirect to login with return URL
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentPath);
      window.location.href = `/login?redirect=${returnUrl}`;
    }
  }

  /**
   * Call Frappe whitelisted method
   * Endpoint format: /api/method/{dotted.path.to.method}
   */
  async call<T>(method: string, args: Record<string, unknown> = {}): Promise<T> {
    const response = await this.request<{ message: T }>(`/api/method/${method}`, {
      method: 'POST',
      body: args,
    });
    return response.message;
  }

  /**
   * Get document by doctype and name
   */
  async getDoc<T>(doctype: string, name: string): Promise<T> {
    const response = await this.request<{ data: T }>(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`
    );
    return response.data;
  }

  /**
   * Get list of documents
   */
  async getList<T>(
    doctype: string,
    options: {
      fields?: string[];
      filters?: Record<string, unknown>;
      order_by?: string;
      limit_start?: number;
      limit_page_length?: number;
    } = {}
  ): Promise<T[]> {
    const params = new URLSearchParams();
    
    if (options.fields) {
      params.set('fields', JSON.stringify(options.fields));
    }
    if (options.filters) {
      params.set('filters', JSON.stringify(options.filters));
    }
    if (options.order_by) {
      params.set('order_by', options.order_by);
    }
    if (options.limit_start !== undefined) {
      params.set('limit_start', String(options.limit_start));
    }
    if (options.limit_page_length !== undefined) {
      params.set('limit_page_length', String(options.limit_page_length));
    }

    const response = await this.request<{ data: T[] }>(
      `/api/resource/${doctype}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Create new document
   */
  async createDoc<T>(doctype: string, doc: Record<string, unknown>): Promise<T> {
    const response = await this.request<{ data: T }>(`/api/resource/${doctype}`, {
      method: 'POST',
      body: doc,
    });
    return response.data;
  }

  /**
   * Update document
   */
  async updateDoc<T>(doctype: string, name: string, doc: Record<string, unknown>): Promise<T> {
    const response = await this.request<{ data: T }>(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`,
      {
        method: 'PUT',
        body: doc,
      }
    );
    return response.data;
  }

  /**
   * Delete document
   */
  async deleteDoc(doctype: string, name: string): Promise<void> {
    await this.request(`/api/resource/${doctype}/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// Export singleton instance
export const frappe = new FrappeClient(API_URL);
export default frappe;
