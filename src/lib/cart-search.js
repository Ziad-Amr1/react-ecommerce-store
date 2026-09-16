import { mockCarts } from "@/lib/mock-carts";
import { filterCartsByQuery, filterCartsByStatus, sortCarts } from "@/lib/cart-helpers";
 
/**
 * Stands in for a real backend call, e.g.:
 *   GET /admin/carts?q=...&status=...&sort=...&page=...&pageSize=...
 *   -> { items: [...], total: 1000 }
 *
 * Takes an AbortSignal so an in-flight request can be cancelled if the user
 * changes a filter before it resolves. Swap the body of this function for a
 * real axios/fetch call using `signal` once the endpoint exists — the
 * response shape ({ items, total }) is already what the page expects, so
 * nothing in Carts.jsx has to change.
 */
export function searchCarts({ query, status, sort, page = 1, pageSize = 10 }, signal) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      let result = mockCarts;
      result = filterCartsByQuery(result, query);
      result = filterCartsByStatus(result, status);
      result = sortCarts(result, sort);
 
      const total = result.length;
      const start = (page - 1) * pageSize;
      const items = result.slice(start, start + pageSize);
 
      resolve({ items, total });
    }, 300); // simulated network latency
 
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
 