import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Filter,
  PlusCircle,
  Sparkles,
  Utensils
} from 'lucide-react';
import { OrderCard } from '../components/OrderCard';
import { ORDER_STATUSES, ORDER_TYPES } from '../utils/invoiceUtils';

export function ActiveOrders({
  orders = [],
  onViewOrder,
  onEditOrder,
  onPrintOrder,
  onUpdateOrderStatus,
  onCancelOrder,
  onGoToPOS
}) {
  const [statusFilter, setStatusFilter] = useState(ORDER_STATUSES.PENDING);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filter pipeline
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter (Pending, Completed, or All)
      if (statusFilter !== 'ALL') {
        if (order.status !== statusFilter) return false;
      }

      // 2. Order Type Filter
      if (typeFilter !== 'ALL' && order.orderType !== typeFilter) {
        return false;
      }

      // 3. Search Query (Order ID, Customer Name, Table No)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = order.id?.toLowerCase().includes(q);
        const nameMatch = order.customerName?.toLowerCase().includes(q);
        const tokenMatch = order.tokenNumber?.toLowerCase().includes(q);
        const tableMatch = order.tableNumber?.toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !tokenMatch && !tableMatch) return false;
      }

      return true;
    });
  }, [orders, statusFilter, typeFilter, searchQuery]);

  // Counts for tabs: Pending and Completed
  const counts = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === ORDER_STATUSES.PENDING).length,
      completed: orders.filter(o => o.status === ORDER_STATUSES.COMPLETED).length,
      all: orders.length
    };
  }, [orders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header & Metrics Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>ACTIVE ORDERS PIPELINE</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time kitchen order management & live table tracking
          </p>
        </div>

        <button
          onClick={onGoToPOS}
          className="btn-accent-action"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <PlusCircle size={16} />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Status Filter Tabs: Pending and Completed */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: ORDER_STATUSES.PENDING, label: 'Pending Orders', count: counts.pending },
            { id: ORDER_STATUSES.COMPLETED, label: 'Completed Orders', count: counts.completed },
            { id: 'ALL', label: 'All Orders', count: counts.all }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: statusFilter === tab.id ? 'var(--bg-dark)' : 'var(--border-color)',
                backgroundColor: statusFilter === tab.id ? 'var(--bg-dark)' : '#FFFFFF',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: statusFilter === tab.id ? 'var(--accent-orange)' : '#E5E7EB',
                  color: statusFilter === tab.id ? '#000' : '#4B5563',
                  fontWeight: 700
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input & Order Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}
            />
            <input
              type="text"
              placeholder="Search ID, customer, table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '7px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              outline: 'none',
              background: '#FFF'
            }}
          >
            <option value="ALL">All Types</option>
            <option value={ORDER_TYPES.DINE_IN}>Dine-in Only</option>
            <option value={ORDER_TYPES.TAKEAWAY}>Takeaway Only</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredOrders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <Clock size={48} style={{ color: '#D1D5DB', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '4px' }}>
              No orders found
            </h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              There are no orders matching the selected filter criteria.
            </p>
            <button
              onClick={onGoToPOS}
              className="btn-accent-action"
              style={{ display: 'inline-flex', padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Utensils size={15} />
              <span>Go to POS & Take Order</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '16px'
            }}
          >
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={onViewOrder}
                onEdit={onEditOrder}
                onPrint={onPrintOrder}
                onStatusChange={onUpdateOrderStatus}
                onCancelOrder={onCancelOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
