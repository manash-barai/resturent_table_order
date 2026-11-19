import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay no-print" onClick={onCancel}>
      <div
        className="modal-content-card"
        style={{ maxWidth: '420px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: isDestructive ? '#FEE2E2' : 'var(--accent-orange-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle
              size={22}
              style={{ color: isDestructive ? '#EF4444' : 'var(--accent-orange-dark)' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{title}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{message}</p>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'transparent', color: '#888', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              background: isDestructive ? '#EF4444' : 'var(--accent-orange)',
              color: isDestructive ? '#FFFFFF' : '#000000',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
