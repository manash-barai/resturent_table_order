import { storageService, STORAGE_KEYS } from './storageService';
import { generateNextOrderId, generateDailyToken, ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, ORDER_TYPES } from '../utils/invoiceUtils';
import { computeBillSummary } from '../utils/calculations';

// Pre-seeded initial orders matching the user prompt's examples
const INITIAL_DEMO_ORDERS = [
  {
    id: 'ORD-1001',
    tokenNumber: 'T-01',
    customerName: 'Rahul',
    customerPhone: '9845012345',
    orderType: ORDER_TYPES.DINE_IN,
    tableNumber: '4',
    items: [
      {
        id: 'dosa-02',
        name: 'Masala Dosa',
        category: 'Dosa',
        price: 90,
        quantity: 2,
        notes: 'Crispy, extra red chutney'
      },
      {
        id: 'idli-01',
        name: 'Plain Idli',
        category: 'Idli',
        price: 40,
        quantity: 1,
        notes: ''
      }
    ],
    notes: 'Please serve quickly',
    discountPercent: 0,
    isTaxEnabled: false,
    taxRatePercent: 5,
    paymentMethod: PAYMENT_METHODS.UPI,
    paymentStatus: PAYMENT_STATUSES.PAID,
    status: ORDER_STATUSES.PENDING,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'ORD-1002',
    tokenNumber: 'T-02',
    customerName: 'Amit',
    customerPhone: '9876543210',
    orderType: ORDER_TYPES.TAKEAWAY,
    tableNumber: '',
    items: [
      {
        id: 'dosa-06',
        name: 'Paper Dosa',
        category: 'Dosa',
        price: 130,
        quantity: 1,
        notes: ''
      },
      {
        id: 'vada-01',
        name: 'Medu Vada',
        category: 'Vada',
        price: 40,
        quantity: 2,
        notes: 'Pack sambar separately'
      }
    ],
    notes: 'Parcel with extra tissues',
    discountPercent: 5,
    isTaxEnabled: false,
    taxRatePercent: 5,
    paymentMethod: PAYMENT_METHODS.CASH,
    paymentStatus: PAYMENT_STATUSES.PAID,
    status: ORDER_STATUSES.PENDING,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'ORD-1003',
    tokenNumber: 'T-03',
    customerName: 'Priya Sharma',
    customerPhone: '9912345678',
    orderType: ORDER_TYPES.DINE_IN,
    tableNumber: '2',
    items: [
      {
        id: 'meals-02',
        name: 'Full Meals',
        category: 'South Indian Meals',
        price: 180,
        quantity: 1,
        notes: 'Extra payasam'
      },
      {
        id: 'bev-01',
        name: 'Filter Coffee',
        category: 'Beverages & Sweets',
        price: 35,
        quantity: 2,
        notes: 'Hot & strong'
      }
    ],
    notes: '',
    discountPercent: 0,
    isTaxEnabled: false,
    taxRatePercent: 5,
    paymentMethod: PAYMENT_METHODS.CARD,
    paymentStatus: PAYMENT_STATUSES.PAID,
    status: ORDER_STATUSES.COMPLETED,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'ORD-1004',
    tokenNumber: 'T-04',
    customerName: 'Karthik Raja',
    customerPhone: '',
    orderType: ORDER_TYPES.DINE_IN,
    tableNumber: '7',
    items: [
      {
        id: 'uttapam-02',
        name: 'Onion Uttapam',
        category: 'Uttapam',
        price: 90,
        quantity: 2,
        notes: 'Less spicy'
      },
      {
        id: 'bev-03',
        name: 'Masala Buttermilk',
        category: 'Beverages & Sweets',
        price: 30,
        quantity: 2,
        notes: 'Chilled'
      }
    ],
    notes: '',
    discountPercent: 0,
    isTaxEnabled: false,
    taxRatePercent: 5,
    paymentMethod: PAYMENT_METHODS.UPI,
    paymentStatus: PAYMENT_STATUSES.PAID,
    status: ORDER_STATUSES.COMPLETED,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
  }
];

export const orderService = {
  /**
   * Fetch all orders from storage, seeding with initial demo data if empty
   */
  getOrders() {
    let orders = storageService.get(STORAGE_KEYS.ORDERS, null);
    if (!orders) {
      orders = INITIAL_DEMO_ORDERS.map(order => this.enrichOrderWithSummary(order));
      storageService.set(STORAGE_KEYS.ORDERS, orders);
    }
    return orders;
  },

  /**
   * Get single order by ID
   */
  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  /**
   * Helper to recalculate totals and attach summary to order
   */
  enrichOrderWithSummary(order) {
    const summary = computeBillSummary({
      items: order.items || [],
      discountPercent: order.discountPercent || 0,
      isTaxEnabled: order.isTaxEnabled ?? false,
      taxRatePercent: order.taxRatePercent ?? 5
    });

    return {
      ...order,
      summary,
      totalAmount: summary.grandTotal,
      itemCount: summary.totalItemCount,
      totalQuantity: summary.totalQuantity
    };
  },

  /**
   * Create a new customer order
   */
  createOrder(orderData) {
    const currentOrders = this.getOrders();
    const newOrderId = orderData.id || generateNextOrderId(currentOrders);
    const tokenNumber = orderData.tokenNumber || generateDailyToken(currentOrders);
    const now = new Date().toISOString();

    const newOrder = {
      id: newOrderId,
      tokenNumber,
      customerName: orderData.customerName?.trim() || 'Walk-in Customer',
      customerPhone: orderData.customerPhone?.trim() || '',
      orderType: orderData.orderType || ORDER_TYPES.DINE_IN,
      tableNumber: orderData.tableNumber || '',
      items: orderData.items || [],
      notes: orderData.notes || '',
      discountPercent: Number(orderData.discountPercent) || 0,
      isTaxEnabled: orderData.isTaxEnabled ?? false,
      taxRatePercent: Number(orderData.taxRatePercent) || 5,
      paymentMethod: orderData.paymentMethod || PAYMENT_METHODS.CASH,
      paymentStatus: orderData.paymentStatus || PAYMENT_STATUSES.PENDING,
      status: orderData.status || ORDER_STATUSES.PENDING,
      createdAt: now,
      updatedAt: now
    };

    const enrichedOrder = this.enrichOrderWithSummary(newOrder);
    // Add to beginning of orders array
    const updatedOrders = [enrichedOrder, ...currentOrders];
    storageService.set(STORAGE_KEYS.ORDERS, updatedOrders);

    return enrichedOrder;
  },

  /**
   * Update an existing order (CRITICAL FEATURE)
   * Updates in-place, never duplicates, recalculates all totals, updates updatedAt
   */
  updateOrder(orderId, updatedData) {
    const currentOrders = this.getOrders();
    const existingIndex = currentOrders.findIndex(o => o.id === orderId);

    if (existingIndex === -1) {
      throw new Error(`Order ${orderId} not found`);
    }

    const existingOrder = currentOrders[existingIndex];
    const now = new Date().toISOString();

    const mergedOrder = {
      ...existingOrder,
      ...updatedData,
      id: existingOrder.id, // Guarantee ID cannot be mutated
      createdAt: existingOrder.createdAt, // Guarantee original creation time preserved
      updatedAt: now // Track update time
    };

    const enrichedOrder = this.enrichOrderWithSummary(mergedOrder);
    currentOrders[existingIndex] = enrichedOrder;
    storageService.set(STORAGE_KEYS.ORDERS, currentOrders);

    return enrichedOrder;
  },

  /**
   * Quick status advancement
   */
  updateOrderStatus(orderId, newStatus) {
    const currentOrders = this.getOrders();
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return null;

    currentOrders[orderIndex].status = newStatus;
    currentOrders[orderIndex].updatedAt = new Date().toISOString();
    storageService.set(STORAGE_KEYS.ORDERS, currentOrders);

    return currentOrders[orderIndex];
  },

  /**
   * Update payment status
   */
  updatePayment(orderId, paymentMethod, paymentStatus) {
    const currentOrders = this.getOrders();
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return null;

    if (paymentMethod) currentOrders[orderIndex].paymentMethod = paymentMethod;
    if (paymentStatus) currentOrders[orderIndex].paymentStatus = paymentStatus;
    currentOrders[orderIndex].updatedAt = new Date().toISOString();

    storageService.set(STORAGE_KEYS.ORDERS, currentOrders);
    return currentOrders[orderIndex];
  },

  /**
   * Delete an order
   */
  deleteOrder(orderId) {
    const currentOrders = this.getOrders();
    const filteredOrders = currentOrders.filter(o => o.id !== orderId);
    storageService.set(STORAGE_KEYS.ORDERS, filteredOrders);
    return true;
  },

  /**
   * Reset orders to initial demo state
   */
  resetToDemo() {
    const orders = INITIAL_DEMO_ORDERS.map(order => this.enrichOrderWithSummary(order));
    storageService.set(STORAGE_KEYS.ORDERS, orders);
    return orders;
  }
};
