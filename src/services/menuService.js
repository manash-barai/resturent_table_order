import { storageService, STORAGE_KEYS } from './storageService';
import { INITIAL_MENU_ITEMS } from '../data/menuData';
import { CATEGORIES } from '../data/categoryData';

export const menuService = {
  getMenuItems() {
    let items = storageService.get(STORAGE_KEYS.MENU, null);
    if (!items || items.length === 0) {
      items = INITIAL_MENU_ITEMS;
      storageService.set(STORAGE_KEYS.MENU, items);
    }
    return items;
  },

  getItemById(id) {
    const items = this.getMenuItems();
    return items.find(item => item.id === id) || null;
  },

  getCategories() {
    let cats = storageService.get(STORAGE_KEYS.CATEGORIES, null);
    if (!cats || cats.length === 0) {
      cats = CATEGORIES;
      storageService.set(STORAGE_KEYS.CATEGORIES, cats);
    }
    return cats;
  },

  toggleAvailability(id) {
    const items = this.getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index].isAvailable = !items[index].isAvailable;
      storageService.set(STORAGE_KEYS.MENU, items);
      return items[index];
    }
    return null;
  },

  updateItem(id, updatedFields) {
    const items = this.getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      storageService.set(STORAGE_KEYS.MENU, items);
      return items[index];
    }
    return null;
  },

  addItem(newItem) {
    const items = this.getMenuItems();
    const newId = newItem.id || `dish-${Date.now()}`;
    const itemToAdd = {
      ...newItem,
      id: newId,
      isAvailable: newItem.isAvailable ?? true,
      price: Number(newItem.price) || 0,
      image: newItem.image || '/images/masala_dosa.jpg'
    };
    const updated = [itemToAdd, ...items];
    storageService.set(STORAGE_KEYS.MENU, updated);
    return itemToAdd;
  },

  deleteItem(id) {
    const items = this.getMenuItems();
    const filtered = items.filter(i => i.id !== id);
    storageService.set(STORAGE_KEYS.MENU, filtered);
    return true;
  },

  resetMenu() {
    storageService.set(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    return INITIAL_MENU_ITEMS;
  }
};
