import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(() => {
    try {
      const data = settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback((updatedFields) => {
    const updated = settingsService.updateSettings(updatedFields);
    setSettings(updated);
    return updated;
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = settingsService.resetSettings();
    setSettings(defaults);
    return defaults;
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
    refreshSettings: loadSettings
  };
}
