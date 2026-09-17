
import { mockCarts } from "@/lib/mock-carts";
import {
  filterCartsByQuery,
  filterCartsByStatus,
  sortCarts,
} from "@/utils/cart-helpers";

export function searchCarts(
  { query, status, sort, page = 1, pageSize = 10 },
  signal
) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      let result = mockCarts;

      result = filterCartsByQuery(result, query);
      result = filterCartsByStatus(result, status);
      result = sortCarts(result, sort);

      const total = result.length;
      const start = (page - 1) * pageSize;
      const items = result.slice(start, start + pageSize);

      resolve({
        items,
        total,
      });
    }, 300);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

