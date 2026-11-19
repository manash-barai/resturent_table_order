import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../services/menuService';

export function useMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMenu = useCallback(() => {
    try {
      const items = menuService.getMenuItems();
      const cats = menuService.getCategories();
      setMenuItems(items);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load menu', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const toggleAvailability = useCallback((id) => {
    const updated = menuService.toggleAvailability(id);
    loadMenu();
    return updated;
  }, [loadMenu]);

  const updateItem = useCallback((id, updatedFields) => {
    const updated = menuService.updateItem(id, updatedFields);
    loadMenu();
    return updated;
  }, [loadMenu]);

  const addItem = useCallback((newItem) => {
    const created = menuService.addItem(newItem);
    loadMenu();
    return created;
  }, [loadMenu]);

  const deleteItem = useCallback((id) => {
    const success = menuService.deleteItem(id);
    loadMenu();
    return success;
  }, [loadMenu]);

  const resetMenu = useCallback(() => {
    const defaults = menuService.resetMenu();
    setMenuItems(defaults);
    return defaults;
  }, []);

  return {
    menuItems,
    categories,
    loading,
    refreshMenu: loadMenu,
    toggleAvailability,
    updateItem,
    addItem,
    deleteItem,
    resetMenu
  };
}
