import React, { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { PrintInvoice } from './components/PrintInvoice';
import { BillPreview } from './components/BillPreview';

// Pages
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { ActiveOrders } from './pages/ActiveOrders';
import { BillingHistory } from './pages/BillingHistory';
import { MenuManagement } from './pages/MenuManagement';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

// Custom Hooks
import { useOrders } from './hooks/useOrders';
import { useMenu } from './hooks/useMenu';
import { useSettings } from './hooks/useSettings';
import { ORDER_STATUSES } from './utils/invoiceUtils';

export function App() {
  const [currentTab, setCurrentTab] = useState('pos');

  // Hooks
  const {
    orders,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    resetOrders
  } = useOrders();

  const {
    menuItems,
    categories,
    toggleAvailability,
    updateItem,
    addItem,
    deleteItem,
    resetMenu
  } = useMenu();

  const {
    settings,
    updateSettings,
    resetSettings
  } = useSettings();

  // Active Order Editing State
  const [editingOrder, setEditingOrder] = useState(null);

  // Responsive Drawer States for Mobile & Tablet
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Modals State
  const [printModalOrder, setPrintModalOrder] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [previewModalOrder, setPreviewModalOrder] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Toasts State
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger confetti effect on major success
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  };

  // Save Order Handler (Supports both Create and Update In-Place)
  const handleSaveOrderSuccess = (orderPayload, isEditMode, existingOrderId) => {
    let savedOrder;

    if (isEditMode && existingOrderId) {
      // Update existing order in-place without duplicate
      savedOrder = updateOrder(existingOrderId, orderPayload);
      showToast(`Order #${existingOrderId} updated successfully!`);
      setEditingOrder(null);
    } else {
      // Create new independent order
      savedOrder = createOrder(orderPayload);
      showToast(`Order #${savedOrder.id} created successfully!`);
      triggerConfetti();
    }

    return savedOrder;
  };

  // Edit Order Trigger (Loads existing order into POS)
  const handleStartEditOrder = (order) => {
    setEditingOrder(order);
    setCurrentTab('pos');
    showToast(`Loaded Order #${order.id} for editing.`, 'info');
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    showToast('Cancelled order editing', 'info');
  };

  // Print Handlers
  const handleOpenPrintModal = (order) => {
    setPrintModalOrder(order);
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setPrintModalOrder(null);
  };

  // Preview Handlers
  const handleOpenPreviewModal = (order) => {
    setPreviewModalOrder(order);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewModalOrder(null);
  };

  // Status Change Handler
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} marked as "${newStatus}"!`);
    if (newStatus === ORDER_STATUSES.COMPLETED) {
      triggerConfetti();
    }
  };

  // Cancel Order Handler
  const handleCancelOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
      updateOrderStatus(orderId, ORDER_STATUSES.CANCELLED);
      showToast(`Order #${orderId} has been cancelled`, 'error');
    }
  };

  // Reset all demo data
  const handleResetAllDemoData = () => {
    resetOrders();
    resetMenu();
    resetSettings();
    setEditingOrder(null);
  };

  // Count pending orders for sidebar badge
  const activeOrdersCount = orders.filter(
    (o) => o.status === ORDER_STATUSES.PENDING
  ).length;

  const tabTitles = {
    dashboard: 'OVERVIEW',
    pos: editingOrder ? `EDITING ${editingOrder.id}` : 'NEW ORDER',
    active_orders: 'KITCHEN ORDERS',
    billing_history: 'INVOICE LOGS',
    menu_mgmt: 'MENU CONFIG',
    reports: 'ANALYTICS',
    settings: 'STORE CONFIG'
  };

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Left Sidebar (with responsive off-canvas drawer) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        activeOrdersCount={activeOrdersCount}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          orders={orders}
          onNewOrderClick={() => {
            setEditingOrder(null);
            setCurrentTab('pos');
            setIsMobileSidebarOpen(false);
          }}
          activeTabTitle={tabTitles[currentTab] || 'POS'}
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onOpenMobileCart={currentTab === 'pos' ? () => setIsMobileCartOpen(true) : null}
        />

        {/* Dynamic Page Views */}
        <main className={`page-container${currentTab === 'pos' ? ' pos-page' : ''}`}>
          {currentTab === 'dashboard' && (
            <Dashboard
              orders={orders}
              menuItems={menuItems}
              onGoToPOS={() => {
                setEditingOrder(null);
                setCurrentTab('pos');
              }}
              onGoToActiveOrders={() => setCurrentTab('active_orders')}
              onViewOrder={handleOpenPreviewModal}
              onPrintOrder={handleOpenPrintModal}
            />
          )}

          {currentTab === 'pos' && (
            <POS
              menuItems={menuItems}
              categories={categories}
              restaurantSettings={settings}
              editingOrder={editingOrder}
              onCancelEdit={handleCancelEdit}
              onSaveOrderSuccess={handleSaveOrderSuccess}
              onOpenPrintModal={handleOpenPrintModal}
              showToast={showToast}
              isMobileCartOpen={isMobileCartOpen}
              setIsMobileCartOpen={setIsMobileCartOpen}
            />
          )}

          {currentTab === 'active_orders' && (
            <ActiveOrders
              orders={orders}
              onViewOrder={handleOpenPreviewModal}
              onEditOrder={handleStartEditOrder}
              onPrintOrder={handleOpenPrintModal}
              onUpdateOrderStatus={handleStatusChange}
              onCancelOrder={handleCancelOrder}
              onGoToPOS={() => {
                setEditingOrder(null);
                setCurrentTab('pos');
              }}
            />
          )}

          {currentTab === 'billing_history' && (
            <BillingHistory
              orders={orders}
              onViewOrder={handleOpenPreviewModal}
              onEditOrder={handleStartEditOrder}
              onPrintOrder={handleOpenPrintModal}
            />
          )}

          {currentTab === 'menu_mgmt' && (
            <MenuManagement
              menuItems={menuItems}
              categories={categories}
              onToggleAvailability={toggleAvailability}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onDeleteItem={deleteItem}
              onResetMenu={resetMenu}
              showToast={showToast}
            />
          )}

          {currentTab === 'reports' && (
            <Reports orders={orders} />
          )}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              onUpdateSettings={updateSettings}
              onResetSettings={resetSettings}
              onResetAllDemoData={handleResetAllDemoData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Bill Preview Modal */}
      <BillPreview
        order={previewModalOrder}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        onEdit={handleStartEditOrder}
        onPrint={handleOpenPrintModal}
      />

      {/* Print Invoice Modal & Browser Print Component */}
      <PrintInvoice
        order={printModalOrder}
        restaurantSettings={settings}
        isOpen={isPrintModalOpen}
        onClose={handleClosePrintModal}
      />
    </div>
  );
}

export default App;
