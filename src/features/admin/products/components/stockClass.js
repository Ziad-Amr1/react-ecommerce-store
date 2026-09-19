import { STOCK_OK_THRESHOLD, STOCK_WARNING_THRESHOLD } from "../constants";

export function stockClass(stock) {
  if (stock > STOCK_OK_THRESHOLD) {
    return "text-(--color-success)";
  }
  if (stock > STOCK_WARNING_THRESHOLD) {
    return "text-(--color-warning)";
  }
  return "text-(--color-error)";
}