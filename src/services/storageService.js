/**
 * Storage Service: Safe wrapper around LocalStorage
 * Handles JSON serialization, corruption recovery, and initial seeding.
 */

export const STORAGE_KEYS = {
  ORDERS: 'south_pos_orders_v1',
  MENU: 'south_pos_menu_v1',
  SETTINGS: 'south_pos_settings_v1',
  CATEGORIES: 'south_pos_categories_v1'
};

export const storageService = {
  /**
   * Get an item from localStorage with fallback
   */
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined || item === '') {
        return fallback;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[storageService] Failed to read key "${key}":`, error);
      return fallback;
    }
  },

  /**
   * Save an item to localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[storageService] Failed to write key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove a specific key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[storageService] Failed to remove key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all application data
   */
  clearAppStorage() {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      return true;
    } catch (error) {
      console.error('[storageService] Failed to clear app storage:', error);
      return false;
    }
  },

  /**
   * Export all data as a backup JSON object
   */
  exportBackup() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      orders: this.get(STORAGE_KEYS.ORDERS, []),
      menu: this.get(STORAGE_KEYS.MENU, []),
      settings: this.get(STORAGE_KEYS.SETTINGS, null),
      categories: this.get(STORAGE_KEYS.CATEGORIES, [])
    };
  },

  /**
   * Import data from a backup JSON object
   */
  importBackup(backupData) {
    try {
      if (!backupData || typeof backupData !== 'object') {
        throw new Error('Invalid backup data format');
      }
      if (backupData.orders) this.set(STORAGE_KEYS.ORDERS, backupData.orders);
      if (backupData.menu) this.set(STORAGE_KEYS.MENU, backupData.menu);
      if (backupData.settings) this.set(STORAGE_KEYS.SETTINGS, backupData.settings);
      if (backupData.categories) this.set(STORAGE_KEYS.CATEGORIES, backupData.categories);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
