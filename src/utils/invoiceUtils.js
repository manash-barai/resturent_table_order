/**
 * Utilities for generating unique order numbers, tokens, and invoice payloads
 */

export function generateNextOrderId(existingOrders = []) {
  if (!existingOrders || existingOrders.length === 0) {
    return 'ORD-1001';
  }

  // Extract all numbers from existing IDs matching ORD-XXXX
  const numbers = existingOrders
    .map(order => {
      const match = String(order.id || '').match(/ORD-(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n) && n > 0);

  if (numbers.length === 0) {
    return `ORD-${1000 + existingOrders.length + 1}`;
  }

  const maxId = Math.max(...numbers);
  return `ORD-${maxId + 1}`;
}

export function generateDailyToken(existingOrders = []) {
  // Count today's orders
  const today = new Date().toDateString();
  const todayOrders = existingOrders.filter(o => {
    try {
      return new Date(o.createdAt).toDateString() === today;
    } catch {
      return false;
    }
  });

  const nextTokenNum = todayOrders.length + 1;
  return `T-${String(nextTokenNum).padStart(2, '0')}`;
}

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_METHODS = {
  CASH: 'Cash',
  UPI: 'UPI',
  CARD: 'Card'
};

export const PAYMENT_STATUSES = {
  PAID: 'Paid',
  PENDING: 'Pending'
};

export const ORDER_TYPES = {
  DINE_IN: 'Dine-in',
  TAKEAWAY: 'Takeaway',
  DELIVERY: 'Delivery'
};
