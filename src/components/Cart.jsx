import React, { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Receipt,
  Printer,
  Save,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Percent,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatCurrency, computeBillSummary } from '../utils/calculations';
import { ORDER_TYPES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../utils/invoiceUtils';

export function Cart({
  cartItems = [],
  customerName = '',
  setCustomerName,
  customerPhone = '',
  setCustomerPhone,
  orderType = ORDER_TYPES.DINE_IN,
  setOrderType,
  tableNumber = '',
  setTableNumber,
  discountPercent = 0,
  setDiscountPercent,
  isTaxEnabled = true,
  setIsTaxEnabled,
  taxRatePercent = 5,
  setTaxRatePercent,
  paymentMethod = PAYMENT_METHODS.CASH,
  setPaymentMethod,
  paymentStatus = PAYMENT_STATUSES.PAID,
  setPaymentStatus,
  orderNotes = '',
  setOrderNotes,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSaveOrder,
  onSaveAndPrint,
  editingOrderId = null,
  onCancelEdit,
  onCloseMobileCart
}) {
  const [showItemNotes, setShowItemNotes] = useState({});

  const summary = computeBillSummary({
    items: cartItems,
    discountPercent,
    isTaxEnabled,
    taxRatePercent
  });

  const toggleItemNoteInput = (itemId) => {
    setShowItemNotes(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="cart-card no-print">
      {/* Edit Mode Top Alert Banner */}
      {editingOrderId && (
        <div className="edit-mode-top-banner">
          <div className="edit-mode-info">
            <Sparkles size={18} style={{ color: '#D97706' }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#92400E' }}>
                Editing Order: {editingOrderId}
              </strong>
              <div style={{ fontSize: '0.74rem', color: '#B45309' }}>
                Updates will overwrite this order in place.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="cancel-edit-btn"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        </div>
      )}

      {/* Cart Header: Title & Customer Info */}
      <div className="cart-header">
        <div className="cart-header-top">
          <div className="cart-title-box">
            <ShoppingCart size={19} style={{ color: 'var(--accent-orange)' }} />
            <h2 className="cart-title">
              {editingOrderId ? 'Edit Order' : 'Current Order'}
            </h2>
            {editingOrderId && <span className="edit-mode-pill">Updating</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isCartEmpty && (
              <button
                type="button"
                onClick={onClearCart}
                style={{
                  fontSize: '0.78rem',
                  color: '#EF4444',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}
                title="Clear all cart items"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}

            {onCloseMobileCart && (
              <button
                type="button"
                onClick={onCloseMobileCart}
                className="cart-close-mobile-btn"
                title="Close Cart"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Customer Name & Table Number */}
        <div className="cart-form-row">
          <input
            type="text"
            className="cart-input"
            placeholder="Customer Name (e.g. Rahul)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          {orderType === ORDER_TYPES.DINE_IN ? (
            <input
              type="text"
              className="cart-input"
              placeholder="Table No (e.g. 4)"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          ) : (
            <input
              type="tel"
              className="cart-input"
              placeholder="Phone (opt)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          )}
        </div>

        {/* Order Type Tabs */}
        <div className="order-type-tabs">
          {Object.values(ORDER_TYPES).map((type) => (
            <button
              key={type}
              type="button"
              className={`order-type-btn ${orderType === type ? 'active' : ''}`}
              onClick={() => setOrderType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="cart-items-container">
        {isCartEmpty ? (
          <div className="empty-cart-state">
            <ShoppingCart size={48} />
            <h4 style={{ fontSize: '1rem', color: '#4B5563', marginBottom: '4px' }}>
              Your cart is empty
            </h4>
            <p style={{ fontSize: '0.8rem' }}>
              Click on any food item to add it to this customer's order.
            </p>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <div className="cart-item-name" title={item.name}>
                      {item.name}
                    </div>
                    <div className="cart-item-unit-price">
                      {formatCurrency(item.price)} each
                    </div>
                    {item.notes && (
                      <div style={{ fontSize: '0.72rem', color: '#D97706', fontStyle: 'italic', marginTop: '2px' }}>
                        Note: {item.notes}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="cart-item-controls">
                    <div className="qty-counter-group" style={{ height: '28px' }}>
                      <button
                        type="button"
                        className="qty-btn"
                        style={{ width: '26px', height: '26px' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-count" style={{ width: '28px', fontSize: '0.85rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="qty-btn"
                        style={{ width: '26px', height: '26px' }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      {formatCurrency(itemTotal)}
                    </div>

                    <button
                      type="button"
                      className="delete-item-btn"
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Billing Footer */}
      {!isCartEmpty && (
        <div className="cart-billing-footer">
          {/* Subtotal */}
          <div className="billing-line">
            <span>Subtotal ({summary.totalQuantity} items):</span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(summary.subtotal)}</span>
          </div>

          {/* Discount Settings */}
          <div className="billing-line">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Percent size={14} /> Discount:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                style={{
                  fontSize: '0.78rem',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: '#FFFFFF'
                }}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={15}>15%</option>
                <option value={20}>20%</option>
              </select>
              {summary.discountAmount > 0 && (
                <span style={{ color: '#16A34A', fontWeight: 600 }}>
                  -{formatCurrency(summary.discountAmount)}
                </span>
              )}
            </div>
          </div>

          {/* GST Tax Toggle & Breakdown */}
          <div className="billing-line">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isTaxEnabled}
                onChange={(e) => setIsTaxEnabled(e.target.checked)}
                style={{ accentColor: 'var(--accent-orange)' }}
              />
              <span>GST ({isTaxEnabled ? `${taxRatePercent}%` : 'Off'}):</span>
            </label>
            <span style={{ fontWeight: 600 }}>
              {isTaxEnabled ? formatCurrency(summary.taxAmount) : '₹0'}
            </span>
          </div>

          {isTaxEnabled && summary.taxAmount > 0 && (
            <div className="billing-line tax-breakdown">
              <span>CGST (2.5%) + SGST (2.5%):</span>
              <span>{formatCurrency(summary.cgstAmount)} + {formatCurrency(summary.sgstAmount)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="grand-total-line">
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Grand Total
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                Inclusive of all taxes
              </div>
            </div>
            <div className="grand-total-val">
              {formatCurrency(summary.grandTotal)}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="payment-method-selector">
            {[
              { id: PAYMENT_METHODS.CASH, label: 'Cash', icon: Banknote },
              { id: PAYMENT_METHODS.UPI, label: 'UPI / QR', icon: Smartphone },
              { id: PAYMENT_METHODS.CARD, label: 'Card', icon: CreditCard }
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  className={`pay-method-btn ${paymentMethod === method.id ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <Icon size={14} />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Save & Save/Print */}
          <div className="cart-actions-group">
            <button
              type="button"
              className="btn-primary-action"
              onClick={onSaveOrder}
            >
              <Save size={16} />
              <span>{editingOrderId ? 'Update Order' : 'Save Order'}</span>
            </button>

            <button
              type="button"
              className="btn-accent-action"
              onClick={onSaveAndPrint}
            >
              <Printer size={16} />
              <span>{editingOrderId ? 'Update & Print' : 'Save & Print'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
