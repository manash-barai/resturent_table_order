import { Search, Sparkles, Filter, X, ShoppingCart } from 'lucide-react';
import { CategoryFilter } from '../components/CategoryFilter';
import { FoodCard } from '../components/FoodCard';
import { Cart } from '../components/Cart';
import { ORDER_TYPES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../utils/invoiceUtils';
import { computeBillSummary, formatCurrency } from '../utils/calculations';
import { useEffect,useState,useMemo } from 'react';

export function POS({
  menuItems = [],
  categories = [],
  restaurantSettings,
  editingOrder = null,
  onCancelEdit,
  onSaveOrderSuccess,
  onOpenPrintModal,
  showToast,
  isMobileCartOpen = false,
  setIsMobileCartOpen
}) {
  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Form State
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState(ORDER_TYPES.DINE_IN);
  const [tableNumber, setTableNumber] = useState('');
  const [discountPercent, setDiscountPercent] = useState(restaurantSettings?.defaultDiscountPercent || 0);
  const [isTaxEnabled, setIsTaxEnabled] = useState(restaurantSettings?.isTaxEnabled ?? false);
  const [taxRatePercent, setTaxRatePercent] = useState(restaurantSettings?.taxRatePercent || 5);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUSES.PAID);
  const [orderNotes, setOrderNotes] = useState('');

  // Synchronize cart with editingOrder when editing an order
  useEffect(() => {
    if (editingOrder) {
      setCartItems(editingOrder.items ? JSON.parse(JSON.stringify(editingOrder.items)) : []);
      setCustomerName(editingOrder.customerName || '');
      setCustomerPhone(editingOrder.customerPhone || '');
      setOrderType(editingOrder.orderType || ORDER_TYPES.DINE_IN);
      setTableNumber(editingOrder.tableNumber || '');
      setDiscountPercent(editingOrder.discountPercent ?? (restaurantSettings?.defaultDiscountPercent || 0));
      setIsTaxEnabled(editingOrder.isTaxEnabled ?? (restaurantSettings?.isTaxEnabled ?? false));
      setTaxRatePercent(editingOrder.taxRatePercent ?? (restaurantSettings?.taxRatePercent || 5));
      setPaymentMethod(editingOrder.paymentMethod || PAYMENT_METHODS.CASH);
      setPaymentStatus(editingOrder.paymentStatus || PAYMENT_STATUSES.PAID);
      setOrderNotes(editingOrder.notes || '');
    }
  }, [editingOrder, restaurantSettings]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      const matchesQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Cart Quantity map for quick lookup
  const cartQtyMap = useMemo(() => {
    const map = {};
    cartItems.forEach((ci) => {
      map[ci.id] = ci.quantity;
    });
    return map;
  }, [cartItems]);

  // Cart Handlers
  const handleAddToCart = (foodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === foodItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === foodItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: foodItem.id,
          name: foodItem.name,
          category: foodItem.category,
          price: foodItem.price,
          quantity: 1,
          notes: ''
        }
      ];
    });
    showToast(`Added "${foodItem.name}" to cart`);
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveItem = (itemId) => {
    const itemToRemove = cartItems.find(i => i.id === itemId);
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setOrderNotes('');
    showToast('Cart cleared', 'info');
  };

  const validateOrder = () => {
    if (cartItems.length === 0) {
      showToast('Please add at least one food item to the order', 'error');
      return false;
    }
    return true;
  };

  const handleSaveOrder = (shouldPrintAfter = false) => {
    if (!validateOrder()) return;

    const orderPayload = {
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim(),
      orderType,
      tableNumber: orderType === ORDER_TYPES.DINE_IN ? tableNumber : '',
      items: cartItems,
      discountPercent,
      isTaxEnabled,
      taxRatePercent,
      paymentMethod,
      paymentStatus,
      notes: orderNotes
    };

    const savedOrder = onSaveOrderSuccess(orderPayload, Boolean(editingOrder), editingOrder?.id);

    // If Save & Print clicked
    if (shouldPrintAfter && savedOrder) {
      onOpenPrintModal(savedOrder);
    }

    // Reset cart if it was a new order or completed edit
    if (!editingOrder) {
      handleClearCart();
    } else {
      onCancelEdit();
      handleClearCart();
    }
  };

  const cartSummary = useMemo(() => {
    return computeBillSummary({
      items: cartItems,
      discountPercent,
      isTaxEnabled,
      taxRatePercent
    });
  }, [cartItems, discountPercent, isTaxEnabled, taxRatePercent]);

  return (
    <div className="pos-container">
      {/* Left Area: Catalog, Filters, Search */}
      <div className="pos-catalog-section">
        {/* Category Filter Pills */}
        <CategoryFilter
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          menuItems={menuItems}
        />

        {/* Live Search Input */}
        <div className="search-box-wrapper no-print">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search dosas, idlis, vadas, uttapams, meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                color: '#888'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Food Items Grid */}
        <div className="food-grid">
          {filteredItems.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-muted)'
              }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                No dishes found matching "{searchQuery}"
              </p>
              <p style={{ fontSize: '0.85rem' }}>Try searching another dish or category.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                cartQuantity={cartQtyMap[item.id] || 0}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile Cart Backdrop Overlay */}
      {isMobileCartOpen && (
        <div
          className="mobile-cart-backdrop no-print"
          onClick={() => setIsMobileCartOpen && setIsMobileCartOpen(false)}
        />
      )}

      {/* Right Area: Dynamic Cart & Billing Panel (Responsive Drawer on mobile/tablet) */}
      <div className={`pos-cart-section ${isMobileCartOpen ? 'mobile-cart-open' : ''}`}>
        <Cart
          cartItems={cartItems}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          orderType={orderType}
          setOrderType={setOrderType}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          discountPercent={discountPercent}
          setDiscountPercent={setDiscountPercent}
          isTaxEnabled={isTaxEnabled}
          setIsTaxEnabled={setIsTaxEnabled}
          taxRatePercent={taxRatePercent}
          setTaxRatePercent={setTaxRatePercent}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          orderNotes={orderNotes}
          setOrderNotes={setOrderNotes}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onSaveOrder={() => handleSaveOrder(false)}
          onSaveAndPrint={() => handleSaveOrder(true)}
          editingOrderId={editingOrder?.id}
          onCancelEdit={onCancelEdit}
          onCloseMobileCart={setIsMobileCartOpen ? () => setIsMobileCartOpen(false) : null}
        />
      </div>

      {/* Mobile Sticky Floating Cart Bar */}
      {cartItems.length > 0 && !isMobileCartOpen && (
        <div className="mobile-cart-floating-bar no-print">
          <button
            type="button"
            className="mobile-cart-floating-btn"
            onClick={() => setIsMobileCartOpen && setIsMobileCartOpen(true)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} />
              <span>{cartSummary.totalQuantity} items in Cart</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '1.05rem' }}>{formatCurrency(cartSummary.grandTotal)}</strong>
              <span className="mobile-cart-floating-action">View Bill →</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
