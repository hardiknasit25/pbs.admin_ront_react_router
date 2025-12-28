/**
 * Cookie Service
 * Provides a type-safe wrapper for cookie management with server-side and client-side support
 */

export interface CookieOptions {
  expires?: number | Date; // Number of days or Date object
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean; // Note: httpOnly can only be set server-side
}

class CookieService {
  /**
   * Check if we're running in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  /**
   * Set a cookie
   * @param name - Cookie name
   * @param value - Cookie value (will be JSON stringified if object)
   * @param options - Cookie options
   */
  setCookie<T>(name: string, value: T, options: CookieOptions = {}): void {
    if (!this.isBrowser()) {
      console.warn(
        "Cookies can only be set on the client side using this method"
      );
      return;
    }

    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(stringValue)}`;

      // Handle expires
      if (options.expires) {
        let expiresDate: Date;
        if (typeof options.expires === "number") {
          expiresDate = new Date();
          expiresDate.setTime(
            expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000
          );
        } else {
          expiresDate = options.expires;
        }
        cookieString += `; expires=${expiresDate.toUTCString()}`;
      }

      // Handle path
      if (options.path) {
        cookieString += `; path=${options.path}`;
      } else {
        cookieString += "; path=/";
      }

      // Handle domain
      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }

      // Handle secure
      if (options.secure) {
        cookieString += "; secure";
      }

      // Handle sameSite
      if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookieString;
    } catch (error) {
      console.error(`Error setting cookie "${name}":`, error);
    }
  }

  /**
   * Get a cookie value
   * @param name - Cookie name
   * @returns The cookie value or null if not found
   */
  getCookie<T = string>(name: string): T | null {
    if (!this.isBrowser()) {
      console.warn(
        "Cookies can only be read on the client side using this method"
      );
      return null;
    }

    try {
      const nameEQ = encodeURIComponent(name) + "=";
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(cookie.substring(nameEQ.length));
          try {
            return JSON.parse(value) as T;
          } catch {
            return value as T;
          }
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting cookie "${name}":`, error);
      return null;
    }
  }

  /**
   * Remove a cookie
   * @param name - Cookie name
   * @param options - Cookie options (path and domain should match the original cookie)
   */
  removeCookie(
    name: string,
    options: Pick<CookieOptions, "path" | "domain"> = {}
  ): void {
    this.setCookie(name, "", {
      ...options,
      expires: new Date(0),
    });
  }

  /**
   * Check if a cookie exists
   * @param name - Cookie name
   * @returns true if the cookie exists, false otherwise
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   * @returns Object with all cookies
   */
  getAllCookies(): Record<string, string> {
    if (!this.isBrowser()) {
      console.warn(
        "Cookies can only be read on the client side using this method"
      );
      return {};
    }

    try {
      const cookies: Record<string, string> = {};
      const cookieArray = document.cookie.split(";");

      for (let cookie of cookieArray) {
        cookie = cookie.trim();
        const [name, value] = cookie.split("=");
        if (name && value) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      }

      return cookies;
    } catch (error) {
      console.error("Error getting all cookies:", error);
      return {};
    }
  }

  /**
   * Clear all cookies (client-side only)
   * Note: This only clears cookies accessible to JavaScript
   */
  clearAllCookies(): void {
    if (!this.isBrowser()) {
      console.warn(
        "Cookies can only be cleared on the client side using this method"
      );
      return;
    }

    try {
      const cookies = this.getAllCookies();
      for (const name in cookies) {
        this.removeCookie(name);
      }
    } catch (error) {
      console.error("Error clearing all cookies:", error);
    }
  }

  /**
   * Server-side: Parse cookies from request headers
   * @param cookieHeader - The cookie header string from request
   * @returns Object with all cookies
   */
  parseCookiesFromHeader(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) {
      return {};
    }

    try {
      const cookies: Record<string, string> = {};
      const cookieArray = cookieHeader.split(";");

      for (let cookie of cookieArray) {
        cookie = cookie.trim();
        const [name, value] = cookie.split("=");
        if (name && value) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      }

      return cookies;
    } catch (error) {
      console.error("Error parsing cookies from header:", error);
      return {};
    }
  }

  /**
   * Server-side: Create a Set-Cookie header string
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   * @returns Set-Cookie header string
   */
  createSetCookieHeader<T>(
    name: string,
    value: T,
    options: CookieOptions = {}
  ): string {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(stringValue)}`;

      // Handle expires
      if (options.expires) {
        let expiresDate: Date;
        if (typeof options.expires === "number") {
          expiresDate = new Date();
          expiresDate.setTime(
            expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000
          );
        } else {
          expiresDate = options.expires;
        }
        cookieString += `; Expires=${expiresDate.toUTCString()}`;
      }

      // Handle path
      if (options.path) {
        cookieString += `; Path=${options.path}`;
      } else {
        cookieString += "; Path=/";
      }

      // Handle domain
      if (options.domain) {
        cookieString += `; Domain=${options.domain}`;
      }

      // Handle secure
      if (options.secure) {
        cookieString += "; Secure";
      }

      // Handle sameSite
      if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
      }

      // Handle httpOnly (server-side only)
      if (options.httpOnly) {
        cookieString += "; HttpOnly";
      }

      return cookieString;
    } catch (error) {
      console.error(`Error creating Set-Cookie header for "${name}":`, error);
      return "";
    }
  }
}

// Export a singleton instance
export const cookieService = new CookieService();
export default cookieService;
