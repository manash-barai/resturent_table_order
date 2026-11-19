import React from 'react';
import { X, Printer, Edit, Clock, User, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { formatDateTime } from '../utils/dateUtils';

export function BillPreview({
  order,
  isOpen,
  onClose,
  onEdit,
  onPrint
}) {
  if (!isOpen || !order) return null;

  const summary = order.summary || {};

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <div
        className="modal-content-card"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#FFF' }}>
              Order Details: {order.id}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-orange)' }}>
              Token: {order.tokenNumber || 'T-01'} • {order.orderType}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#FFF', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          {/* Customer Meta */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: '#F9FAFB',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}
          >
            <div>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>Customer:</span>
              <div style={{ fontWeight: 700 }}>{order.customerName || 'Walk-in'}</div>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>Status:</span>
              <div>
                <span className={`status-pill ${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>Ordered At:</span>
              <div>{formatDateTime(order.createdAt)}</div>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>Payment:</span>
              <div style={{ fontWeight: 600 }}>
                {order.paymentMethod} ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Items Table */}
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
            Ordered Items ({order.items?.length || 0})
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EEE', textAlign: 'left', color: '#777' }}>
                <th style={{ padding: '6px 0' }}>Item</th>
                <th style={{ padding: '6px 0', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '6px 0', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '6px 0', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '8px 0' }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    {item.notes && (
                      <div style={{ fontSize: '0.72rem', color: '#D97706' }}>
                        Note: {item.notes}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Breakdown */}
          <div
            style={{
              borderTop: '2px dashed #E5E7EB',
              paddingTop: '12px',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(summary.subtotal)}</span>
            </div>

            {summary.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#16A34A' }}>
                <span>Discount ({summary.discountPercent}%):</span>
                <span>-{formatCurrency(summary.discountAmount)}</span>
              </div>
            )}

            {summary.isTaxEnabled && summary.taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#666' }}>
                <span>GST ({summary.taxRatePercent}%):</span>
                <span>{formatCurrency(summary.taxAmount)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 800,
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: '1px solid #E5E7EB'
              }}
            >
              <span>Grand Total:</span>
              <span>{formatCurrency(summary.grandTotal ?? order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FAFAFA',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}
        >
          <button
            onClick={() => {
              onClose();
              onEdit(order);
            }}
            className="btn-primary-action"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Edit size={15} />
            <span>Edit Order</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onPrint(order);
            }}
            className="btn-accent-action"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Printer size={15} />
            <span>Print Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
