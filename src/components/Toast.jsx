import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container no-print">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderCol = 'var(--accent-orange)';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderCol = '#EF4444';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderCol = '#3B82F6';
        }

        return (
          <div
            key={toast.id}
            className="toast-item"
            style={{ borderLeftColor: borderCol }}
          >
            <Icon size={18} style={{ color: borderCol, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
