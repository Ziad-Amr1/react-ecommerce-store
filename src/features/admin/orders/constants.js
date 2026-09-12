export const ORDERS_LIMIT = 15;
export { ORDER_CURRENCY } from "@/utils/formatCurrency";
export const ORDER_STATUSES = [
  "delivered",
  "shipped",
  "confirmed",
  "processing",
  "cancelled",
];
export const PAYMENT_STATUSES = ["paid", "pending"];
export const SORT_COLUMNS = {
  date: "createdAt",
  status: "status",
  total: "totalPrice",
};