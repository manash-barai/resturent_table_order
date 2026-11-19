import React from 'react';
import {
  UtensilsCrossed,
  Flame,
  CircleDot,
  Layers,
  Disc,
  Sparkles,
  Coffee
} from 'lucide-react';

const ICON_MAP = {
  UtensilsCrossed,
  Flame,
  CircleDot,
  Layers,
  Disc,
  Sparkles,
  Coffee
};

export function CategoryFilter({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
  menuItems = []
}) {
  return (
    <div className="category-filter-bar no-print">
      {categories.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon] || UtensilsCrossed;
        const isActive = activeCategory === cat.id;

        // Calculate count of items in this category
        const count = cat.id === 'all'
          ? menuItems.length
          : menuItems.filter(item => item.categoryId === cat.id).length;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`category-pill ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={16} style={{ color: isActive ? 'var(--accent-orange)' : 'inherit' }} />
            <span>{cat.name}</span>
            <span className="category-count-badge">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
