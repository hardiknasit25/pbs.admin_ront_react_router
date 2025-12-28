/**
 * LocalStorage Service
 * Provides a type-safe wrapper around localStorage with server-side safety
 */

class LocalStorageService {
  /**
   * Check if we're running in a browser environment
   */
  private isBrowser(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  /**
   * Set an item in localStorage
   * @param key - The key to store the value under
   * @param value - The value to store (will be JSON stringified)
   */
  setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) {
      console.warn("localStorage is not available on the server");
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  }

  /**
   * Get an item from localStorage
   * @param key - The key to retrieve
   * @returns The parsed value or null if not found
   */
  getItem<T>(key: string): T | null {
    if (!this.isBrowser()) {
      console.warn("localStorage is not available on the server");
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting localStorage item "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    if (!this.isBrowser()) {
      console.warn("localStorage is not available on the server");
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    if (!this.isBrowser()) {
      console.warn("localStorage is not available on the server");
      return;
    }

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  /**
   * Get all keys from localStorage
   * @returns Array of all keys
   */
  getAllKeys(): string[] {
    if (!this.isBrowser()) {
      console.warn("localStorage is not available on the server");
      return [];
    }

    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error("Error getting localStorage keys:", error);
      return [];
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param key - The key to check
   * @returns true if the key exists, false otherwise
   */
  hasItem(key: string): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    return window.localStorage.getItem(key) !== null;
  }

  /**
   * Get the number of items in localStorage
   * @returns The number of items
   */
  getLength(): number {
    if (!this.isBrowser()) {
      return 0;
    }

    return window.localStorage.length;
  }
}

// Export a singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;
