import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  Clock,
  Receipt,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  X
} from 'lucide-react';

export function Sidebar({
  currentTab,
  setCurrentTab,
  activeOrdersCount = 0,
  isOpen = false,
  onClose
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'pos',
      label: 'New Order / POS',
      icon: Utensils,
      badge: 'Live'
    },
    {
      id: 'active_orders',
      label: 'Active Orders',
      icon: Clock,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null
    },
    {
      id: 'billing_history',
      label: 'Billing History',
      icon: Receipt,
      badge: null
    },
    {
      id: 'menu_mgmt',
      label: 'Menu Management',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelectNav = (tabId) => {
    setCurrentTab(tabId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop no-print"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar no-print ${isOpen ? 'mobile-open' : ''}`}>
        {/* Brand & Logo Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <Sparkles size={24} />
          </div>
          <div className="brand-info" style={{ flex: 1 }}>
            <h2>DAKSHIN SWAAD</h2>
            <span>Restaurant POS</span>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            title="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
              >
                <div className="nav-label-group">
                  <Icon size={19} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cashier / Staff Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar">DS</div>
            <div className="user-details" style={{ flex: 1 }}>
              <h4>Cashier Terminal #1</h4>
              <p>Dakshin Express Branch</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
