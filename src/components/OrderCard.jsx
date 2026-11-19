import React from 'react';
import {
  Clock,
  Printer,
  Edit,
  Eye,
  CheckCircle,
  ArrowRight,
  User,
  Utensils,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { formatRelativeTime, formatTime } from '../utils/dateUtils';
import { ORDER_STATUSES } from '../utils/invoiceUtils';

export function OrderCard({
  order,
  onView,
  onEdit,
  onPrint,
  onStatusChange,
  onCancelOrder
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return 'pending';
      case ORDER_STATUSES.COMPLETED:
        return 'completed';
      case ORDER_STATUSES.CANCELLED:
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === ORDER_STATUSES.PENDING) return ORDER_STATUSES.COMPLETED;
    return null;
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all var(--transition-normal)'
      }}
      className="order-card-hover"
    >
      {/* Top Meta Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#000' }}>
              {order.id}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#F3F4F6',
                color: '#4B5563',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}
            >
              {order.tokenNumber || 'T-01'}
            </span>
          </div>

          <span className={`status-pill ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Customer & Type Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <User size={15} style={{ color: 'var(--text-muted)' }} />
          <strong style={{ fontSize: '0.95rem' }}>{order.customerName || 'Walk-in'}</strong>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            • {order.orderType} {order.tableNumber ? `(Table ${order.tableNumber})` : ''}
          </span>
        </div>

        {/* Timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#777', marginBottom: '12px' }}>
          <Clock size={13} />
          <span>{formatTime(order.createdAt)} ({formatRelativeTime(order.createdAt)})</span>
          {order.updatedAt && order.updatedAt !== order.createdAt && (
            <span style={{ color: '#D97706', fontWeight: 600 }}>• Edited</span>
          )}
        </div>

        {/* Items Summary List */}
        <div
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: 'var(--radius-sm)',
            padding: '10px',
            marginBottom: '14px',
            fontSize: '0.82rem'
          }}
        >
          {(order.items || []).slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '3px 0',
                color: '#333'
              }}
            >
              <span><strong>{item.quantity}×</strong> {item.name}</span>
              <span style={{ color: '#666' }}>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          {order.items?.length > 3 && (
            <div style={{ fontSize: '0.74rem', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>
              +{order.items.length - 3} more items...
            </div>
          )}
        </div>
      </div>

      {/* Footer: Total & Actions */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#777', textTransform: 'uppercase' }}>
              Total Amount
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000' }}>
              {formatCurrency(order.summary?.grandTotal ?? order.totalAmount)}
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
            <span
              style={{
                backgroundColor: order.paymentStatus === 'Paid' ? '#DCFCE7' : '#FEF3C7',
                color: order.paymentStatus === 'Paid' ? '#166534' : '#92400E',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}
            >
              {order.paymentMethod} • {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: 'grid', gridTemplateColumns: nextStatus ? '1fr 1fr' : '1fr', gap: '8px' }}>
          {/* Status Advance Button */}
          {nextStatus ? (
            <button
              type="button"
              onClick={() => onStatusChange(order.id, nextStatus)}
              className="btn-accent-action"
              style={{ padding: '8px 10px', fontSize: '0.8rem', backgroundColor: '#10B981', color: '#FFF' }}
            >
              <CheckCircle size={15} />
              <span>Mark Completed</span>
            </button>
          ) : order.status === ORDER_STATUSES.COMPLETED ? (
            <button
              type="button"
              onClick={() => onStatusChange(order.id, ORDER_STATUSES.PENDING)}
              style={{
                padding: '8px 10px',
                fontSize: '0.78rem',
                backgroundColor: '#F3F4F6',
                color: '#4B5563',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={13} />
              <span>Reopen (Pending)</span>
            </button>
          ) : null}

          {/* Quick Action Icons */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: nextStatus ? 'flex-end' : 'space-between' }}>
            <button
              type="button"
              onClick={() => onView(order)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFF',
                color: '#333'
              }}
              title="View Details"
            >
              <Eye size={15} />
            </button>

            <button
              type="button"
              onClick={() => onEdit(order)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFF',
                color: '#2563EB'
              }}
              title="Edit Order in POS"
            >
              <Edit size={15} />
            </button>

            <button
              type="button"
              onClick={() => onPrint(order)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#FFF',
                color: '#000'
              }}
              title="Print Receipt"
            >
              <Printer size={15} />
            </button>

            {order.status !== ORDER_STATUSES.CANCELLED && order.status !== ORDER_STATUSES.COMPLETED && (
              <button
                type="button"
                onClick={() => onCancelOrder(order.id)}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #FECACA',
                  background: '#FFF',
                  color: '#EF4444'
                }}
                title="Cancel Order"
              >
                <XCircle size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
