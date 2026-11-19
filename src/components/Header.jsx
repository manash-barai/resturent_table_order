import React, { useState, useEffect } from 'react';
import {
  Clock,
  TrendingUp,
  Receipt,
  PlusCircle,
  Maximize2,
  Menu,
  ShoppingCart
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export function Header({
  orders = [],
  onNewOrderClick,
  activeTabTitle = 'POS & BILLING',
  onToggleSidebar,
  onOpenMobileCart,
  cartItemCount = 0
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate today's stats
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => {
    try {
      return new Date(o.createdAt).toDateString() === todayStr;
    } catch {
      return false;
    }
  });

  const todayRevenue = todayOrders.reduce((sum, o) => {
    return sum + (Number(o.summary?.grandTotal ?? o.totalAmount) || 0);
  }, 0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="top-header no-print">
      <div className="header-left-group">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="mobile-nav-toggle"
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-title-container">
          <h1 className="header-title">
            SUPER FAST POS & BILLING
          </h1>
          <span className="header-badge">{activeTabTitle}</span>
        </div>
      </div>

      <div className="header-stats-group">
        {/* Today's Orders Chip (Hidden on mobile) */}
        <div className="header-stat-chip hide-mobile">
          <Receipt size={15} style={{ color: 'var(--accent-orange)' }} />
          <span>Orders:</span>
          <span className="header-stat-val">{todayOrders.length}</span>
        </div>

        {/* Today's Sales Chip (Hidden on small mobile) */}
        <div className="header-stat-chip hide-mobile-sm">
          <TrendingUp size={15} style={{ color: '#10B981' }} />
          <span>Sales:</span>
          <span className="header-stat-val" style={{ color: '#10B981' }}>
            {formatCurrency(todayRevenue)}
          </span>
        </div>

        {/* Live Clock (Hidden on tablet/mobile) */}
        <div className="header-stat-chip hide-tablet" style={{ fontFamily: 'var(--font-mono)' }}>
          <Clock size={15} style={{ color: 'var(--accent-orange)' }} />
          <span>{currentTime.toLocaleTimeString('en-IN', { hour12: true })}</span>
        </div>

        {/* Mobile View Cart Button (Visible on mobile/tablet) */}
        {onOpenMobileCart && (
          <button
            type="button"
            onClick={onOpenMobileCart}
            className="mobile-cart-header-btn"
            title="Open Cart"
          >
            <ShoppingCart size={17} />
            {cartItemCount > 0 && (
              <span className="cart-header-badge">{cartItemCount}</span>
            )}
          </button>
        )}

        {/* New Order Quick Button */}
        <button
          onClick={onNewOrderClick}
          className="btn-accent-action"
          style={{ padding: '7px 12px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          title="Create New Order"
        >
          <PlusCircle size={15} />
          <span className="hide-mobile-sm">New Order</span>
        </button>

        {/* Fullscreen Button (Desktop only) */}
        <button
          onClick={toggleFullscreen}
          className="hide-tablet"
          style={{
            background: 'var(--bg-dark-card)',
            color: '#CCC',
            border: '1px solid var(--border-dark)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Toggle Fullscreen"
        >
          <Maximize2 size={15} />
        </button>
      </div>
    </header>
  );
}
