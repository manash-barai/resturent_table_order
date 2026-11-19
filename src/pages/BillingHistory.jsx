import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  Filter,
  Eye,
  Edit,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  Download,
  RotateCcw
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { formatDateTime, formatDate, isToday, isYesterday } from '../utils/dateUtils';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '../utils/invoiceUtils';

export function BillingHistory({
  orders = [],
  onViewOrder,
  onEditOrder,
  onPrintOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'TODAY', 'YESTERDAY', 'WEEK', 'ALL'
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search (ID, customer name, token, phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = order.id?.toLowerCase().includes(q);
        const nameMatch = order.customerName?.toLowerCase().includes(q);
        const phoneMatch = order.customerPhone?.toLowerCase().includes(q);
        const tokenMatch = order.tokenNumber?.toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !phoneMatch && !tokenMatch) return false;
      }

      // 2. Date Filter
      if (dateFilter === 'TODAY' && !isToday(order.createdAt)) return false;
      if (dateFilter === 'YESTERDAY' && !isYesterday(order.createdAt)) return false;
      if (dateFilter === 'WEEK') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (new Date(order.createdAt) < weekAgo) return false;
      }

      // 3. Payment Method Filter
      if (paymentFilter !== 'ALL' && order.paymentMethod !== paymentFilter) return false;

      // 4. Payment Status Filter
      if (statusFilter !== 'ALL' && order.paymentStatus !== statusFilter) return false;

      return true;
    });
  }, [orders, searchQuery, dateFilter, paymentFilter, statusFilter]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalInvoices = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => {
      return sum + (Number(o.summary?.grandTotal ?? o.totalAmount) || 0);
    }, 0);

    const cashRevenue = filteredOrders
      .filter(o => o.paymentMethod === PAYMENT_METHODS.CASH)
      .reduce((sum, o) => sum + (Number(o.summary?.grandTotal ?? o.totalAmount) || 0), 0);

    const digitalRevenue = filteredOrders
      .filter(o => o.paymentMethod === PAYMENT_METHODS.UPI || o.paymentMethod === PAYMENT_METHODS.CARD)
      .reduce((sum, o) => sum + (Number(o.summary?.grandTotal ?? o.totalAmount) || 0), 0);

    return { totalInvoices, totalRevenue, cashRevenue, digitalRevenue };
  }, [filteredOrders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>BILLING & INVOICE HISTORY</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Review all customer bills, search transactions, edit past orders, or reprint tax invoices
        </p>
      </div>

      {/* Metrics Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Invoices
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#000', marginTop: '4px' }}>
            {stats.totalInvoices}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Billed Revenue
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-orange-dark)', marginTop: '4px' }}>
            {formatCurrency(stats.totalRevenue)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
            Cash Collections
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
            {formatCurrency(stats.cashRevenue)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>
            UPI & Card Collections
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>
            {formatCurrency(stats.digitalRevenue)}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 260px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
          />
          <input
            type="text"
            placeholder="Search by order #, customer name, token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Date:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#FFF'
            }}
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="WEEK">Last 7 Days</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#FFF'
            }}
          >
            <option value="ALL">All Methods</option>
            <option value={PAYMENT_METHODS.CASH}>Cash</option>
            <option value={PAYMENT_METHODS.UPI}>UPI</option>
            <option value={PAYMENT_METHODS.CARD}>Card</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#FFF'
            }}
          >
            <option value="ALL">All Status</option>
            <option value={PAYMENT_STATUSES.PAID}>Paid</option>
            <option value={PAYMENT_STATUSES.PENDING}>Pending</option>
          </select>
        </div>
      </div>

      {/* Historical Orders Table */}
      <div className="custom-table-card">
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Receipt size={48} style={{ color: '#D1D5DB', marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.05rem', color: '#374151', marginBottom: '4px' }}>
              No billing records found
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              Try adjusting your search queries or date filters.
            </p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Items</th>
                <th style={{ textAlign: 'right' }}>Grand Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalAmount = order.summary?.grandTotal ?? order.totalAmount;
                const itemsCount = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
                const isUpdated = Boolean(order.updatedAt && order.updatedAt !== order.createdAt);

                return (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: '#000', fontSize: '0.92rem' }}>
                        {order.id}
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: '#F3F4F6',
                          color: '#4B5563',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        {order.tokenNumber || 'T-01'}
                      </span>
                      {isUpdated && (
                        <span
                          style={{
                            marginLeft: '4px',
                            fontSize: '0.68rem',
                            color: '#D97706',
                            fontWeight: 700
                          }}
                        >
                          (Edited)
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {formatDateTime(order.createdAt)}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        {order.customerName || 'Walk-in'}
                      </div>
                      {order.customerPhone && (
                        <div style={{ fontSize: '0.74rem', color: '#777' }}>
                          {order.customerPhone}
                        </div>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        {order.orderType}
                        {order.tableNumber ? ` (T${order.tableNumber})` : ''}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#555' }}>
                        {itemsCount} items
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: '#000',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {formatCurrency(totalAmount)}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          backgroundColor: order.paymentStatus === 'Paid' ? '#DCFCE7' : '#FEF3C7',
                          color: order.paymentStatus === 'Paid' ? '#166534' : '#92400E'
                        }}
                      >
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span className={`status-pill ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {/* View Invoice */}
                        <button
                          onClick={() => onViewOrder(order)}
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: '#FFF',
                            color: '#333'
                          }}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit Order */}
                        <button
                          onClick={() => onEditOrder(order)}
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: '#FFF',
                            color: '#2563EB'
                          }}
                          title="Edit this Order"
                        >
                          <Edit size={15} />
                        </button>

                        {/* Reprint Bill */}
                        <button
                          onClick={() => onPrintOrder(order)}
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: '#FFF',
                            color: '#000'
                          }}
                          title="Reprint Bill"
                        >
                          <Printer size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
