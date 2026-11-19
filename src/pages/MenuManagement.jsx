import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export function MenuManagement({
  menuItems = [],
  categories = [],
  onToggleAvailability,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onResetMenu,
  showToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dosa',
    categoryId: 'dosa',
    price: '',
    description: '',
    image: '/images/masala_dosa.jpg',
    isAvailable: true
  });

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchQuery = !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Dosa',
      categoryId: 'dosa',
      price: '',
      description: '',
      image: '/images/masala_dosa.jpg',
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      categoryId: item.categoryId || 'dosa',
      price: item.price,
      description: item.description,
      image: item.image,
      isAvailable: item.isAvailable !== false
    });
    setIsModalOpen(true);
  };

  const handleCategorySelectChange = (catId) => {
    const found = categories.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      categoryId: catId,
      category: found ? found.name : 'Dosa'
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter item name', 'error');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    if (editingItem) {
      onUpdateItem(editingItem.id, {
        name: formData.name.trim(),
        category: formData.category,
        categoryId: formData.categoryId,
        price: Number(formData.price),
        description: formData.description.trim(),
        image: formData.image,
        isAvailable: formData.isAvailable
      });
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      onAddItem({
        name: formData.name.trim(),
        category: formData.category,
        categoryId: formData.categoryId,
        price: Number(formData.price),
        description: formData.description.trim(),
        image: formData.image,
        isAvailable: formData.isAvailable
      });
      showToast(`Added new dish "${formData.name}" to menu!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>MENU MANAGEMENT</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure dishes, update prices, toggle live stock availability, or create new items
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (window.confirm('Reset all menu items to initial defaults?')) {
                onResetMenu();
                showToast('Menu reset to defaults', 'info');
              }
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="btn-accent-action"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 260px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: '#666', fontWeight: 600 }}>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#FFF'
            }}
          >
            <option value="all">All Categories ({menuItems.length})</option>
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="custom-table-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Image</th>
              <th>Dish Name</th>
              <th>Category</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'center' }}>Stock Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const isAvailable = item.isAvailable !== false;
              return (
                <tr key={item.id} style={{ opacity: isAvailable ? 1 : 0.65 }}>
                  <td>
                    <img
                      src={item.image || '/images/masala_dosa.jpg'}
                      alt={item.name}
                      style={{
                        width: '44px',
                        height: '44px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}
                    />
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#000' }}>
                      {item.name}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>ID: {item.id}</span>
                  </td>

                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#F3F4F6',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600
                      }}
                    >
                      {item.category}
                    </span>
                  </td>

                  <td>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        maxWidth: '280px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={item.description}
                    >
                      {item.description}
                    </p>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000' }}>
                      {formatCurrency(item.price)}
                    </span>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isAvailable ? '#DCFCE7' : '#FEE2E2',
                        color: isAvailable ? '#166534' : '#991B1B',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title="Click to toggle availability"
                    >
                      {isAvailable ? '● In Stock' : '✕ Sold Out'}
                    </button>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      <button
                        onClick={() => openEditModal(item)}
                        style={{
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: '#FFF',
                          color: '#2563EB'
                        }}
                        title="Edit Dish"
                      >
                        <Edit size={15} />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${item.name}" from menu?`)) {
                            onDeleteItem(item.id);
                            showToast(`Deleted "${item.name}"`, 'info');
                          }
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid #FECACA',
                          background: '#FFF',
                          color: '#EF4444'
                        }}
                        title="Delete Dish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content-card"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--bg-dark)',
                color: '#FFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', color: '#FFF' }}>
                {editingItem ? 'Edit Dish' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', color: '#FFF' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ghee Podi Roast"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                {/* Category & Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleCategorySelectChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem',
                        background: '#FFF'
                      }}
                    >
                      {categories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 110"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Crispy crepe served with coconut chutney & sambar..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Food Image Asset
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      background: '#FFF'
                    }}
                  >
                    <option value="/images/masala_dosa.jpg">Masala Dosa (Golden Crepe)</option>
                    <option value="/images/idli_sambar.jpg">Idli Sambar (Steamed Cakes)</option>
                    <option value="/images/medu_vada.jpg">Medu Vada (Crispy Fritters)</option>
                    <option value="/images/onion_uttapam.jpg">Onion Uttapam (Savory Pancake)</option>
                    <option value="/images/south_indian_thali.jpg">South Indian Thali (Full Feast)</option>
                    <option value="/images/filter_coffee.jpg">Filter Coffee (Traditional Brass Kaapi)</option>
                  </select>
                </div>

                {/* Availability Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="isAvailableCheckbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    style={{ accentColor: 'var(--accent-orange)' }}
                  />
                  <label htmlFor="isAvailableCheckbox" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Available in stock for ordering
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: '#FFF',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent-action"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  {editingItem ? 'Save Changes' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
