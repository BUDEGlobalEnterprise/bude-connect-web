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
  silent?: boolean; // If true, don't trigger auto-redirect on session expiry
}

class FrappeClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get CSRF token from cookie (set by Frappe on login)
   */
  getCsrfToken(): string {
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    return match ? match[1] : '';
  }

  /**
   * Clear cached CSRF token (call on logout)
   */
  clearCsrfToken(): void {
    // CSRF token is read directly from document.cookie, no local caching
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
      if (!options.silent) {
        this.handleSessionExpiry();
      }
      throw new ApiError(response.status, 'Session expired. Please log in again.', {});
    }

    // Handle CSRF token expiry (417)
    if (response.status === 417) {
      this.clearCsrfToken();
      // Throw without auto-redirecting globally
      throw new ApiError(417, 'Security token expired. Please refresh the page.', {});
    }

    // Handle rate limiting (429)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '60';
      this.handleRateLimit(parseInt(retryAfter, 10));
      throw new ApiError(response.status, `Too many requests. Please try again in ${retryAfter} seconds.`, { retryAfter });
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
   * Upload a file to Frappe
   */
  async upload(file: File, options: { 
    isPrivate?: boolean; 
    folder?: string; 
    doctype?: string; 
    docname?: string; 
    fieldname?: string 
  } = {}): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_private', options.isPrivate ? '1' : '0');
    if (options.folder) formData.append('folder', options.folder);
    if (options.doctype) formData.append('doctype', options.doctype);
    if (options.docname) formData.append('docname', options.docname);
    if (options.fieldname) formData.append('fieldname', options.fieldname);

    const response = await fetch(`${this.baseUrl}/api/method/upload_file`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-Frappe-CSRF-Token': this.getCsrfToken(),
      },
    });

    if (!response.ok) {
      if (response.status === 417) {
        this.handleSessionExpiry();
        throw new ApiError(417, 'Security token expired. Please log in again.', {});
      }
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new ApiError(response.status, error.message || 'Upload failed', error);
    }

    const result = await response.json();
    return result.message;
  }

  /**
   * Handle session expiry - redirect to login
   */
  private handleSessionExpiry(): void {
    if (typeof window === 'undefined') return;

    // Clear cached token
    this.clearCsrfToken();

    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/login' || currentPath === '/oauth/callback' || currentPath.includes('/verify-email');

    // Show toast notification (if toast system available)
    if ((window as any).showToast && !isAuthPage) {
      (window as any).showToast({
        type: 'error',
        message: 'Your session has expired. Please log in again.',
        duration: 5000,
      });
    }

    // Prevent loop if already on login page or redirected to oauth
    if (isAuthPage) {
      console.warn('FrappeClient: Prevented redirect loop while already on auth page');
      return;
    }

    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    
    // Only set redirect if we are not already going to /login
    if (currentPath !== '/login') {
      console.log('FrappeClient: Redirecting to login due to session expiry');
      window.location.href = `/login?redirect=${returnUrl}`;
    }
  }

  /**
   * Handle rate limiting - show warning to user
   */
  private handleRateLimit(retryAfter: number): void {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'warning',
        message: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
        duration: retryAfter * 1000,
      });
    }
  }

  /**
   * Call Frappe whitelisted method
   * Endpoint format: /api/method/{dotted.path.to.method}
   */
  async call<T>(method: string, args: Record<string, unknown> = {}, silent: boolean = false): Promise<T> {
    const response = await this.request<{ message: any }>(`/api/method/${method}`, {
      method: 'POST',
      body: args,
      silent
    });
    
    const msg = response.message;
    
    // Automatically unwrap Bude success_response if it contains a data key
    if (msg && typeof msg === 'object' && msg.success === true && 'data' in msg) {
      return msg.data as T;
    }
    
    return msg as T;
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
    return this.status === 401 || this.status === 403 || this.status === 417;
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
