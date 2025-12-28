/**
 * SessionStorage Service
 * Provides a type-safe wrapper around sessionStorage with server-side safety
 */

class SessionStorageService {
  /**
   * Check if we're running in a browser environment
   */
  private isBrowser(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.sessionStorage !== "undefined"
    );
  }

  /**
   * Set an item in sessionStorage
   * @param key - The key to store the value under
   * @param value - The value to store (will be JSON stringified)
   */
  setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) {
      console.warn("sessionStorage is not available on the server");
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting sessionStorage item "${key}":`, error);
    }
  }

  /**
   * Get an item from sessionStorage
   * @param key - The key to retrieve
   * @returns The parsed value or null if not found
   */
  getItem<T>(key: string): T | null {
    if (!this.isBrowser()) {
      console.warn("sessionStorage is not available on the server");
      return null;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting sessionStorage item "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove an item from sessionStorage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    if (!this.isBrowser()) {
      console.warn("sessionStorage is not available on the server");
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage item "${key}":`, error);
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  clear(): void {
    if (!this.isBrowser()) {
      console.warn("sessionStorage is not available on the server");
      return;
    }

    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }

  /**
   * Get all keys from sessionStorage
   * @returns Array of all keys
   */
  getAllKeys(): string[] {
    if (!this.isBrowser()) {
      console.warn("sessionStorage is not available on the server");
      return [];
    }

    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error("Error getting sessionStorage keys:", error);
      return [];
    }
  }

  /**
   * Check if a key exists in sessionStorage
   * @param key - The key to check
   * @returns true if the key exists, false otherwise
   */
  hasItem(key: string): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    return window.sessionStorage.getItem(key) !== null;
  }

  /**
   * Get the number of items in sessionStorage
   * @returns The number of items
   */
  getLength(): number {
    if (!this.isBrowser()) {
      return 0;
    }

    return window.sessionStorage.length;
  }
}

// Export a singleton instance
export const sessionStorageService = new SessionStorageService();
export default sessionStorageService;
