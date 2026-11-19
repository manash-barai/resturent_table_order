/**
 * Utility functions for currency formatting and billing calculations
 */

export function formatCurrency(amount) {
  const numeric = Number(amount) || 0;
  return `₹${numeric.toLocaleString('en-IN', {
    minimumFractionDigits: numeric % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

export function calculateCartItemTotal(item) {
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;
  return price * quantity;
}

export function computeBillSummary({
  items = [],
  discountPercent = 0,
  isTaxEnabled = true,
  taxRatePercent = 5
}) {
  // 1. Calculate item subtotal
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateCartItemTotal(item);
  }, 0);

  // 2. Calculate total items & quantity
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalItemCount = items.length;

  // 3. Calculate discount
  const validDiscountPercent = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  const discountAmount = Math.round((subtotal * validDiscountPercent) / 100);

  // 4. Calculate taxable amount
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // 5. Calculate Tax / GST
  let taxAmount = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;

  if (isTaxEnabled && taxRatePercent > 0) {
    taxAmount = (taxableAmount * taxRatePercent) / 100;
    cgstAmount = taxAmount / 2;
    sgstAmount = taxAmount / 2;
  }

  // 6. Grand total and Rounding
  const rawTotal = taxableAmount + taxAmount;
  const grandTotal = Math.round(rawTotal);
  const roundOff = Number((grandTotal - rawTotal).toFixed(2));

  return {
    subtotal,
    totalQuantity,
    totalItemCount,
    discountPercent: validDiscountPercent,
    discountAmount,
    taxableAmount,
    isTaxEnabled,
    taxRatePercent: isTaxEnabled ? taxRatePercent : 0,
    taxAmount: Number(taxAmount.toFixed(2)),
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    cgstRate: isTaxEnabled ? (taxRatePercent / 2) : 0,
    sgstRate: isTaxEnabled ? (taxRatePercent / 2) : 0,
    roundOff,
    grandTotal
  };
}
