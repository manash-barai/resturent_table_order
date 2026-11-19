import { computeBillSummary, formatCurrency } from '../utils/calculations';

export const billingService = {
  calculateBill(options) {
    return computeBillSummary(options);
  },

  formatAmount(amount) {
    return formatCurrency(amount);
  },

  /**
   * Generates a complete invoice payload for an order
   */
  generateInvoicePayload(order, restaurantSettings) {
    const billSummary = computeBillSummary({
      items: order.items || [],
      discountPercent: order.discountPercent || 0,
      isTaxEnabled: order.isTaxEnabled ?? restaurantSettings?.isTaxEnabled ?? true,
      taxRatePercent: order.taxRatePercent ?? restaurantSettings?.taxRatePercent ?? 5
    });

    return {
      orderId: order.id,
      tokenNumber: order.tokenNumber || 'T-01',
      customerName: order.customerName || 'Walk-in Customer',
      customerPhone: order.customerPhone || '',
      orderType: order.orderType || 'Dine-in',
      tableNumber: order.tableNumber || '',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      isUpdated: Boolean(order.updatedAt && order.updatedAt !== order.createdAt),
      items: (order.items || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        notes: item.notes || ''
      })),
      notes: order.notes || '',
      paymentMethod: order.paymentMethod || 'Cash',
      paymentStatus: order.paymentStatus || 'Paid',
      status: order.status || 'Pending',
      summary: billSummary,
      restaurant: {
        name: restaurantSettings?.restaurantName || 'Dakshin Swaad Restaurant',
        tagline: restaurantSettings?.tagline || 'Authentic South Indian Pure Veg',
        address: restaurantSettings?.address || 'Bengaluru',
        phone: restaurantSettings?.phone || '',
        gstin: restaurantSettings?.gstin || '',
        fssai: restaurantSettings?.fssai || '',
        footerMessage: restaurantSettings?.receiptFooterMessage || 'Thank You! Visit Again.'
      }
    };
  }
};
