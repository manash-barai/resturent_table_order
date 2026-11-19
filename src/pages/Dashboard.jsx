import React, { useMemo } from 'react';
import {
  TrendingUp,
  Receipt,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Flame,
  PlusCircle,
  Eye,
  Printer
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { formatTime, formatRelativeTime, isToday } from '../utils/dateUtils';
import { ORDER_STATUSES } from '../utils/invoiceUtils';

export function Dashboard({
  orders = [],
  menuItems = [],
  onGoToPOS,
  onGoToActiveOrders,
  onViewOrder,
  onPrintOrder
}) {
  // Aggregate calculations
  const stats = useMemo(() => {
    const todayOrders = orders.filter(o => isToday(o.createdAt));
    const activeOrders = orders.filter(
      o => o.status === ORDER_STATUSES.PENDING
    );

    const todaySales = todayOrders.reduce((sum, o) => {
      return sum + (Number(o.summary?.grandTotal ?? o.totalAmount) || 0);
    }, 0);

    const totalLifetimeSales = orders.reduce((sum, o) => {
      return sum + (Number(o.summary?.grandTotal ?? o.totalAmount) || 0);
    }, 0);

    const aov = todayOrders.length > 0 ? Math.round(todaySales / todayOrders.length) : 0;

    // Calculate top selling dishes
    const dishSales = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!dishSales[item.name]) {
          dishSales[item.name] = { name: item.name, quantity: 0, revenue: 0, category: item.category };
        }
        dishSales[item.name].quantity += (Number(item.quantity) || 1);
        dishSales[item.name].revenue += ((Number(item.quantity) || 1) * (Number(item.price) || 0));
      });
    });

    const topDishes = Object.values(dishSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      todayOrdersCount: todayOrders.length,
      todaySales,
      totalLifetimeSales,
      activeOrdersCount: activeOrders.length,
      aov,
      topDishes,
      recentOrders: orders.slice(0, 5)
    };
  }, [orders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1F1F1F 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          color: '#FFFFFF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid var(--border-dark)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)', marginBottom: '4px' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Restaurant Operations
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            Welcome to Dakshin Swaad POS
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#B3B3B3', marginTop: '2px' }}>
            Fast billing, dynamic order management, and instant thermal receipt printing
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onGoToActiveOrders}
            style={{
              backgroundColor: '#2A2A2A',
              color: '#FFF',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #444'
            }}
          >
            <Clock size={16} style={{ color: 'var(--accent-orange)' }} />
            <span>Active Orders ({stats.activeOrdersCount})</span>
          </button>

          <button
            onClick={onGoToPOS}
            className="btn-accent-action"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <PlusCircle size={18} />
            <span>New POS Order</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Today's Sales */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
              Today's Sales
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A'
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginTop: '8px' }}>
            {formatCurrency(stats.todaySales)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>
            ● Live revenue today
          </div>
        </div>

        {/* Today's Orders */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
              Today's Orders
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-orange-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-orange-dark)'
              }}
            >
              <Receipt size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginTop: '8px' }}>
            {stats.todayOrdersCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
            Customers served today
          </div>
        </div>

        {/* Kitchen Active Orders */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
              Kitchen Pipeline
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB'
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '8px' }}>
            {stats.activeOrdersCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
            Pending or preparing now
          </div>
        </div>

        {/* Average Order Value */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
              Avg Order Value (AOV)
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED'
              }}
            >
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginTop: '8px' }}>
            {formatCurrency(stats.aov)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
            Per ticket average
          </div>
        </div>
      </div>

      {/* Lower Dashboard Section: Recent Orders & Top Selling Dishes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Recent Orders List */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Orders</h3>
            <button
              onClick={onGoToActiveOrders}
              style={{
                fontSize: '0.8rem',
                color: 'var(--link-color)',
                background: 'transparent',
                fontWeight: 600
              }}
            >
              View All →
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.85rem' }}>No orders placed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.88rem' }}>{order.id}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>({order.customerName})</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#888', marginTop: '2px' }}>
                      {formatTime(order.createdAt)} • {order.items?.length || 0} items
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {formatCurrency(order.summary?.grandTotal ?? order.totalAmount)}
                      </div>
                      <span className={`status-pill ${order.status?.toLowerCase()}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {order.status}
                      </span>
                    </div>

                    <button
                      onClick={() => onPrintOrder(order)}
                      style={{ background: 'transparent', color: '#444', padding: '4px' }}
                      title="Print"
                    >
                      <Printer size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Food Items */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={18} style={{ color: 'var(--accent-orange)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Popular Dishes</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#666' }}>Top Selling</span>
          </div>

          {stats.topDishes.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.85rem' }}>No sales data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.topDishes.map((dish, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <div>
                      <strong style={{ color: '#000' }}>#{idx + 1} {dish.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '6px' }}>
                        ({dish.quantity} sold)
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--accent-orange-dark)' }}>
                      {formatCurrency(dish.revenue)}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, (dish.quantity / (stats.topDishes[0]?.quantity || 1)) * 100)}%`,
                        height: '100%',
                        backgroundColor: idx === 0 ? 'var(--accent-orange)' : '#1F2937',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
