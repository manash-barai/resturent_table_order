import React, { useState } from 'react';
import { Printer, X, Download, Share2, CheckCircle2, RotateCw } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { formatDateTime } from '../utils/dateUtils';

export function PrintInvoice({
  order,
  restaurantSettings,
  isOpen,
  onClose
}) {
  const [printFormat, setPrintFormat] = useState(restaurantSettings?.printFormat || 'thermal');

  if (!isOpen || !order) return null;

  const summary = order.summary || {};
  const isThermal = printFormat === 'thermal';

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay print-modal-active" onClick={onClose}>
      <div
        className="modal-content-card"
        style={{ maxWidth: isThermal ? '460px' : '750px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Header (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-dark)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-dark)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Printer size={20} style={{ color: 'var(--accent-orange)' }} />
            <div>
              <h3 style={{ fontSize: '1rem', color: '#FFF' }}>Invoice Preview</h3>
              <span style={{ fontSize: '0.75rem', color: '#AAA' }}>
                Order #{order.id} {order.updatedAt && order.updatedAt !== order.createdAt ? '(Updated)' : ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Format Toggle: 80mm Thermal vs A4 */}
            <div
              style={{
                display: 'flex',
                background: '#2A2A2A',
                borderRadius: 'var(--radius-sm)',
                padding: '2px',
                border: '1px solid #444'
              }}
            >
              <button
                type="button"
                onClick={() => setPrintFormat('thermal')}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  background: isThermal ? 'var(--accent-orange)' : 'transparent',
                  color: isThermal ? '#000' : '#AAA'
                }}
              >
                80mm Thermal
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('a4')}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  background: !isThermal ? 'var(--accent-orange)' : 'transparent',
                  color: !isThermal ? '#000' : '#AAA'
                }}
              >
                A4 Standard
              </button>
            </div>

            <button
              onClick={handleTriggerPrint}
              className="btn-accent-action"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Printer size={15} />
              <span>Print Now</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', color: '#FFF', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          style={{
            padding: isThermal ? '24px 20px' : '36px 40px',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 70px)',
            backgroundColor: '#FFFFFF',
            color: '#000000'
          }}
        >
          <div
            id="printable-receipt-area"
            className={isThermal ? 'receipt-thermal-mode' : 'receipt-a4-mode'}
            style={{
              fontFamily: isThermal ? "'Courier New', Courier, monospace" : "'Poppins', sans-serif",
              maxWidth: isThermal ? '320px' : '100%',
              margin: '0 auto',
              backgroundColor: '#FFF'
            }}
          >
            {/* Restaurant Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <h2
                style={{
                  fontSize: isThermal ? '1.15rem' : '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '2px'
                }}
              >
                {restaurantSettings?.restaurantName || 'DAKSHIN SWAAD'}
              </h2>
              <div style={{ fontSize: isThermal ? '0.78rem' : '0.9rem', color: '#444' }}>
                {restaurantSettings?.tagline || 'Pure South Indian Vegetarian'}
              </div>
              <div style={{ fontSize: isThermal ? '0.74rem' : '0.85rem', color: '#555', marginTop: '3px' }}>
                {restaurantSettings?.address}
              </div>
              <div style={{ fontSize: isThermal ? '0.74rem' : '0.85rem', color: '#555' }}>
                Phone: {restaurantSettings?.phone}
              </div>
              {restaurantSettings?.gstin && (
                <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '2px' }}>
                  GSTIN: {restaurantSettings.gstin} | FSSAI: {restaurantSettings.fssai || 'N/A'}
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                borderBottom: isThermal ? '1px dashed #000' : '1px solid #CCC',
                margin: '10px 0'
              }}
            />

            {/* Bill Meta Info */}
            <div style={{ fontSize: isThermal ? '0.78rem' : '0.88rem', lineHeight: '1.45' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Bill No:</strong> {order.id}</span>
                <span><strong>Token:</strong> {order.tokenNumber || 'T-01'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Customer:</strong> {order.customerName || 'Walk-in'}</span>
                <span><strong>Type:</strong> {order.orderType || 'Dine-in'} {order.tableNumber ? `(Table ${order.tableNumber})` : ''}</span>
              </div>
              <div>
                <strong>Date & Time:</strong> {formatDateTime(order.createdAt)}
              </div>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div style={{ color: '#D97706', fontSize: '0.72rem', fontWeight: 700 }}>
                  * Updated: {formatDateTime(order.updatedAt)}
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                borderBottom: isThermal ? '1px dashed #000' : '1px solid #CCC',
                margin: '10px 0'
              }}
            />

            {/* Itemized Table */}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: isThermal ? '0.78rem' : '0.9rem',
                textAlign: 'left'
              }}
            >
              <thead>
                <tr style={{ borderBottom: isThermal ? '1px dashed #000' : '2px solid #333' }}>
                  <th style={{ padding: '6px 0', textAlign: 'left' }}>Item Name</th>
                  <th style={{ padding: '6px 0', textAlign: 'center', width: '40px' }}>Qty</th>
                  <th style={{ padding: '6px 0', textAlign: 'right', width: '55px' }}>Price</th>
                  <th style={{ padding: '6px 0', textAlign: 'right', width: '65px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item, idx) => {
                  const itemTotal = item.price * item.quantity;
                  return (
                    <tr key={idx} style={{ borderBottom: isThermal ? '1px dotted #CCC' : '1px solid #EEE' }}>
                      <td style={{ padding: '6px 0' }}>
                        <div>{item.name}</div>
                        {item.notes && (
                          <div style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                            ({item.notes})
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(itemTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Divider */}
            <div
              style={{
                borderBottom: isThermal ? '1px dashed #000' : '1px solid #CCC',
                margin: '10px 0'
              }}
            />

            {/* Billing Breakdown */}
            <div style={{ fontSize: isThermal ? '0.78rem' : '0.88rem', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({summary.totalQuantity || order.items?.reduce((s, i) => s + i.quantity, 0)} items):</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>

              {summary.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Discount ({summary.discountPercent}%):</span>
                  <span>-{formatCurrency(summary.discountAmount)}</span>
                </div>
              )}

              {summary.isTaxEnabled && summary.taxAmount > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CGST ({summary.cgstRate}%):</span>
                    <span>{formatCurrency(summary.cgstAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SGST ({summary.sgstRate}%):</span>
                    <span>{formatCurrency(summary.sgstAmount)}</span>
                  </div>
                </>
              )}

              {/* Grand Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: isThermal ? '1rem' : '1.25rem',
                  fontWeight: 900,
                  marginTop: '8px',
                  paddingTop: '6px',
                  borderTop: isThermal ? '2px solid #000' : '2px solid #333'
                }}
              >
                <span>GRAND TOTAL:</span>
                <span>{formatCurrency(summary.grandTotal ?? order.totalAmount)}</span>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                borderBottom: isThermal ? '1px dashed #000' : '1px solid #CCC',
                margin: '10px 0'
              }}
            />

            {/* Payment Details */}
            <div style={{ fontSize: isThermal ? '0.76rem' : '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Payment Method:</strong></span>
                <span>{order.paymentMethod || 'Cash'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Payment Status:</strong></span>
                <span>{order.paymentStatus || 'Paid'}</span>
              </div>
            </div>

            {/* Footer Message */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '16px',
                paddingTop: '10px',
                borderTop: isThermal ? '1px dashed #000' : '1px solid #EEE'
              }}
            >
              <div style={{ fontSize: isThermal ? '0.85rem' : '1rem', fontWeight: 700 }}>
                {restaurantSettings?.receiptFooterMessage || 'Thank You! Visit Again.'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#777', marginTop: '4px' }}>
                Powered by Dakshin Swaad POS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
