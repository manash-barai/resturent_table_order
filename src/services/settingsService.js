import { storageService, STORAGE_KEYS } from './storageService';
import { INITIAL_SETTINGS } from '../data/settingsData';

export const settingsService = {
  getSettings() {
    let settings = storageService.get(STORAGE_KEYS.SETTINGS, null);
    if (!settings) {
      settings = INITIAL_SETTINGS;
      storageService.set(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  },

  updateSettings(updatedSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...updatedSettings };
    storageService.set(STORAGE_KEYS.SETTINGS, merged);
    return merged;
  },

  resetSettings() {
    storageService.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  }
};
