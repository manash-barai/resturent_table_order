import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  Utensils
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { PAYMENT_METHODS } from '../utils/invoiceUtils';

export function Reports({ orders = [] }) {
  const reports = useMemo(() => {
    let totalSales = 0;
    let totalItemsSold = 0;
    const categoryTotals = {};
    const paymentTotals = {
      [PAYMENT_METHODS.CASH]: 0,
      [PAYMENT_METHODS.UPI]: 0,
      [PAYMENT_METHODS.CARD]: 0
    };
    const dishRevenue = {};

    orders.forEach((order) => {
      const orderTotal = Number(order.summary?.grandTotal ?? order.totalAmount) || 0;
      totalSales += orderTotal;

      // Payment Breakdown
      const method = order.paymentMethod || PAYMENT_METHODS.CASH;
      paymentTotals[method] = (paymentTotals[method] || 0) + orderTotal;

      // Items & Category Breakdown
      (order.items || []).forEach((item) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const itemRev = qty * price;
        totalItemsSold += qty;

        const cat = item.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + itemRev;

        if (!dishRevenue[item.name]) {
          dishRevenue[item.name] = { name: item.name, quantity: 0, revenue: 0, category: cat };
        }
        dishRevenue[item.name].quantity += qty;
        dishRevenue[item.name].revenue += itemRev;
      });
    });

    const categoryList = Object.entries(categoryTotals)
      .map(([name, revenue]) => ({
        name,
        revenue,
        percentage: totalSales > 0 ? Math.round((revenue / totalSales) * 100) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const topDishes = Object.values(dishRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const aov = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

    return {
      totalSales,
      totalOrders: orders.length,
      totalItemsSold,
      aov,
      categoryList,
      paymentTotals,
      topDishes
    };
  }, [orders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>REPORTS & ANALYTICS</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Commercial sales performance, payment channels, and popular dish rankings
        </p>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Gross Sales</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-orange-dark)', marginTop: '4px' }}>
            {formatCurrency(reports.totalSales)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '2px' }}>Total all-time revenue</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders Billed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginTop: '4px' }}>
            {reports.totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Total receipts processed</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Dishes Sold</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>
            {reports.totalItemsSold}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Total portions prepared</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Average Ticket (AOV)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginTop: '4px' }}>
            {formatCurrency(reports.aov)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Average revenue per customer</div>
        </div>
      </div>

      {/* Charts / Distributions Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Category-wise Sales Breakdown */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
            Category-wise Sales Contribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reports.categoryList.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <div>
                    <span style={{ fontWeight: 700, color: '#000' }}>{formatCurrency(cat.revenue)}</span>
                    <span style={{ color: '#666', fontSize: '0.75rem', marginLeft: '6px' }}>({cat.percentage}%)</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${cat.percentage}%`,
                      height: '100%',
                      backgroundColor: idx === 0 ? 'var(--accent-orange)' : idx === 1 ? '#2563EB' : '#10B981',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
            Payment Method Split
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                name: 'Cash In Hand',
                icon: Banknote,
                color: '#10B981',
                amount: reports.paymentTotals[PAYMENT_METHODS.CASH] || 0
              },
              {
                name: 'UPI / QR Code',
                icon: Smartphone,
                color: 'var(--accent-orange)',
                amount: reports.paymentTotals[PAYMENT_METHODS.UPI] || 0
              },
              {
                name: 'Credit / Debit Card',
                icon: CreditCard,
                color: '#2563EB',
                amount: reports.paymentTotals[PAYMENT_METHODS.CARD] || 0
              }
            ].map((p, idx) => {
              const Icon = p.icon;
              const pct = reports.totalSales > 0 ? Math.round((p.amount / reports.totalSales) * 100) : 0;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={18} style={{ color: p.color }} />
                      <strong style={{ fontSize: '0.88rem' }}>{p.name}</strong>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#000' }}>
                      {formatCurrency(p.amount)} ({pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: p.color, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
