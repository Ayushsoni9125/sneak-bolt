export { cn } from "cn";

/**
 * Format currency in Indian Rupees (₹)
 */
export function formatPrice(amount: number, showDecimals = false): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}
