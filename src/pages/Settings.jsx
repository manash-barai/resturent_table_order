import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  Printer,
  Database,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { storageService } from '../services/storageService';

export function Settings({
  settings,
  onUpdateSettings,
  onResetSettings,
  onResetAllDemoData,
  showToast
}) {
  const [formState, setFormState] = useState({
    restaurantName: settings?.restaurantName || 'Dakshin Swaad Restaurant',
    tagline: settings?.tagline || 'Authentic South Indian Pure Veg',
    address: settings?.address || 'Shop 12, Temple Road, Bengaluru - 560038',
    phone: settings?.phone || '+91 98765 43210',
    email: settings?.email || 'contact@dakshinswaad.in',
    gstin: settings?.gstin || '29AABCU9603R1ZM',
    fssai: settings?.fssai || '11223344000189',
    isTaxEnabled: settings?.isTaxEnabled ?? true,
    taxRatePercent: settings?.taxRatePercent || 5,
    defaultDiscountPercent: settings?.defaultDiscountPercent || 0,
    printFormat: settings?.printFormat || 'thermal',
    receiptFooterMessage: settings?.receiptFooterMessage || 'Thank You! Visit Again.'
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSettings({
      ...formState,
      taxRatePercent: Number(formState.taxRatePercent) || 5,
      defaultDiscountPercent: Number(formState.defaultDiscountPercent) || 0
    });
    showToast('Restaurant settings saved successfully!');
  };

  const handleExportBackup = () => {
    const backup = storageService.exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dakshin_pos_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>RESTAURANT SETTINGS</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Configure restaurant identity, billing tax rates, invoice templates, and data backups
        </p>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Restaurant Profile Card */}
        <div style={{ backgroundColor: '#FFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Store size={20} style={{ color: 'var(--accent-orange)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Restaurant Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Restaurant Name
              </label>
              <input
                type="text"
                value={formState.restaurantName}
                onChange={(e) => setFormState({ ...formState, restaurantName: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formState.tagline}
                onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Store Address
              </label>
              <input
                type="text"
                value={formState.address}
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                GSTIN Registration
              </label>
              <input
                type="text"
                value={formState.gstin}
                onChange={(e) => setFormState({ ...formState, gstin: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                FSSAI License No
              </label>
              <input
                type="text"
                value={formState.fssai}
                onChange={(e) => setFormState({ ...formState, fssai: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Billing & Tax Settings Card */}
        <div style={{ backgroundColor: '#FFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Printer size={20} style={{ color: 'var(--accent-orange)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Tax & Print Configuration</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={formState.isTaxEnabled}
                  onChange={(e) => setFormState({ ...formState, isTaxEnabled: e.target.checked })}
                  style={{ accentColor: 'var(--accent-orange)' }}
                />
                <span>Enable GST by Default</span>
              </label>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                Calculates CGST and SGST equally on bill subtotal.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={formState.taxRatePercent}
                onChange={(e) => setFormState({ ...formState, taxRatePercent: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Default Receipt Printer Format
              </label>
              <select
                value={formState.printFormat}
                onChange={(e) => setFormState({ ...formState, printFormat: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem', background: '#FFF' }}
              >
                <option value="thermal">80mm Thermal Receipt (Restaurant Standard)</option>
                <option value="a4">Standard A4 Tax Invoice</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Receipt Footer Greeting
              </label>
              <input
                type="text"
                value={formState.receiptFooterMessage}
                onChange={(e) => setFormState({ ...formState, receiptFooterMessage: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div>
          <button
            type="submit"
            className="btn-accent-action"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            <Save size={18} />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* LocalStorage Data Controls Card */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '24px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Database size={20} style={{ color: '#2563EB' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>LocalStorage Data Management</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '16px' }}>
          Export your restaurant's orders, menu, and settings to a JSON backup, or reset to initial demonstration state.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={handleExportBackup}
            style={{
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={15} />
            <span>Export Backup JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo orders and menu back to initial setup?')) {
                onResetAllDemoData();
                showToast('All data reset to initial demo state!', 'info');
              }
            }}
            style={{
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #FECACA',
              background: '#FFF',
              color: '#EF4444',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
