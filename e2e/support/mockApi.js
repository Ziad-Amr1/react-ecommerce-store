export const ADMIN_USER = {
  _id: "admin1",
  username: "janesmith",
  fullName: "Jane Smith",
  email: "jane@example.com",
  role: "admin",
};

// Enough products for 2 pages (PAGE_SIZE=10) with varied categories/brands.
export const PRODUCTS = [
  { _id: "p1", name: "Wireless Headphones", category: "Electronics", brand: "TechNova", price: 1200, stock: 30, tags: ["audio"], images: [] },
  { _id: "p2", name: "Smart Watch", category: "Electronics", brand: "ChronoTech", price: 2500, stock: 12, tags: ["wearable"], images: [] },
  { _id: "p3", name: "Bluetooth Speaker", category: "Electronics", brand: "TechNova", price: 800, stock: 40, tags: ["audio"], images: [] },
  { _id: "p4", name: "Running Shoes", category: "Sports", brand: "FastFeet", price: 1500, stock: 25, tags: ["running"], images: [] },
  { _id: "p5", name: "Yoga Mat", category: "Sports", brand: "ZenGear", price: 350, stock: 60, tags: ["yoga"], images: [] },
  { _id: "p6", name: "Coffee Maker", category: "Kitchen", brand: "BrewMaster", price: 1800, stock: 8, tags: ["coffee"], images: [] },
  { _id: "p7", name: "Air Purifier", category: "Home", brand: "CleanAir", price: 3000, stock: 15, tags: ["air"], images: [] },
  { _id: "p8", name: "Desk Lamp", category: "Home", brand: "BrightHome", price: 600, stock: 45, tags: ["lighting"], images: [] },
  { _id: "p9", name: "Noise Cancelling Headphones", category: "Electronics", brand: "AudioPro", price: 3500, stock: 5, tags: ["audio"], images: [] },
  { _id: "p10", name: "Stainless Steel Bottle", category: "Kitchen", brand: "HydroLife", price: 200, stock: 100, tags: ["hydration"], images: [] },
  { _id: "p11", name: "Wireless Charger", category: "Electronics", brand: "TechNova", price: 450, stock: 35, tags: ["charging"], images: [] },
  { _id: "p12", name: "Backpack", category: "Accessories", brand: "TravelPack", price: 900, stock: 20, tags: ["travel"], images: [] },
];

// Enough orders for 2 pages (ORDERS_LIMIT=15) with varied statuses.
export const ORDERS = [
  { _id: "ord1", shippingAddress: { fullName: "Alice Johnson" }, createdAt: "2024-06-15T10:30:00Z", status: "delivered", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 2400 },
  { _id: "ord2", shippingAddress: { fullName: "Bob Smith" }, createdAt: "2024-06-16T11:00:00Z", status: "processing", paymentMethod: "cash", paymentStatus: "pending", totalPrice: 800 },
  { _id: "ord3", shippingAddress: { fullName: "Carol Williams" }, createdAt: "2024-06-17T09:15:00Z", status: "shipped", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 3500 },
  { _id: "ord4", shippingAddress: { fullName: "David Brown" }, createdAt: "2024-06-18T14:45:00Z", status: "confirmed", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 1200 },
  { _id: "ord5", shippingAddress: { fullName: "Eva Martinez" }, createdAt: "2024-06-19T08:20:00Z", status: "cancelled", paymentMethod: "cash", paymentStatus: "pending", totalPrice: 600 },
  { _id: "ord6", shippingAddress: { fullName: "Frank Garcia" }, createdAt: "2024-06-20T16:00:00Z", status: "delivered", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 4200 },
  { _id: "ord7", shippingAddress: { fullName: "Grace Lee" }, createdAt: "2024-06-21T12:30:00Z", status: "processing", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 950 },
  { _id: "ord8", shippingAddress: { fullName: "Hank Wilson" }, createdAt: "2024-06-22T10:10:00Z", status: "shipped", paymentMethod: "cash", paymentStatus: "pending", totalPrice: 2100 },
  { _id: "ord9", shippingAddress: { fullName: "Iris Chen" }, createdAt: "2024-06-23T09:45:00Z", status: "delivered", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 1800 },
  { _id: "ord10", shippingAddress: { fullName: "Jake Davis" }, createdAt: "2024-06-24T11:20:00Z", status: "confirmed", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 3200 },
  { _id: "ord11", shippingAddress: { fullName: "Karen Patel" }, createdAt: "2024-06-25T15:00:00Z", status: "processing", paymentMethod: "cash", paymentStatus: "pending", totalPrice: 450 },
  { _id: "ord12", shippingAddress: { fullName: "Leo Nguyen" }, createdAt: "2024-06-26T08:00:00Z", status: "delivered", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 2700 },
  { _id: "ord13", shippingAddress: { fullName: "Mia Thompson" }, createdAt: "2024-06-27T13:15:00Z", status: "shipped", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 1100 },
  { _id: "ord14", shippingAddress: { fullName: "Noah Kim" }, createdAt: "2024-06-28T10:45:00Z", status: "cancelled", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 500 },
  { _id: "ord15", shippingAddress: { fullName: "Olivia Wang" }, createdAt: "2024-06-29T12:00:00Z", status: "delivered", paymentMethod: "cash", paymentStatus: "paid", totalPrice: 1950 },
  { _id: "ord16", shippingAddress: { fullName: "Peter Yang" }, createdAt: "2024-06-30T09:30:00Z", status: "processing", paymentMethod: "cash", paymentStatus: "pending", totalPrice: 2800 },
];

// Enough users for 2 client-side pages (USERS_PER_PAGE=10).
export const USERS = [
  { _id: "u1", username: "janesmith", email: "jane@example.com", role: "admin" },
  { _id: "u2", username: "bobwilson", email: "bob@example.com", role: "customer" },
  { _id: "u3", username: "caroladams", email: "carol@example.com", role: "admin" },
  { _id: "u4", username: "davidlee", email: "david@example.com", role: "customer" },
  { _id: "u5", username: "evamartinez", email: "eva@example.com", role: "customer" },
  { _id: "u6", username: "franknguyen", email: "frank@example.com", role: "customer" },
  { _id: "u7", username: "gracechen", email: "grace@example.com", role: "customer" },
  { _id: "u8", username: "hankjohnson", email: "hank@example.com", role: "customer" },
  { _id: "u9", username: "irispatel", email: "iris@example.com", role: "customer" },
  { _id: "u10", username: "jakebrown", email: "jake@example.com", role: "customer" },
  { _id: "u11", username: "karenwilliams", email: "karen@example.com", role: "customer" },
  { _id: "u12", username: "leodavis", email: "leo@example.com", role: "customer" },
];

// Enough carts for 2 pages (CARTS_LIMIT=10). Mirrors the documented
// GET /orders/admin/carts payload: user, items, subtotal and itemCount only.
export const CARTS = Array.from({ length: 12 }, (_, index) => {
  const n = index + 1;
  const items = [
    { _id: `ci${n}-1`, product: `p${n}`, name: `Product ${n}`, image: null, price: 100 * n, quantity: 2 },
    { _id: `ci${n}-2`, product: `p${n}b`, name: `Product ${n}B`, image: null, price: 50, quantity: 1 },
  ];
  return {
    _id: `cart${n}`,
    user: { username: `customer${n}`, email: `customer${n}@example.com` },
    items,
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
});

// Daily-revenue keys are generated relative to "today" using local-midnight
// dates matching the client-side `dateRange.js` toDateKey logic so the
// dashboard chart shows the expected number of points.
export function createDashboard() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysKey = (offset) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return {
    orders: {
      total: 16,
      pending: 4,
      processing: 4,
      confirmed: 2,
      shipped: 3,
      delivered: 5,
      cancelled: 2,
    },
    revenue: {
      total: 89450,
      thisMonth: 28400,
      lastMonth: 25100,
      growthPercent: 13.1,
    },
    dailyRevenue: [
      { _id: daysKey(0), revenue: 120000, orders: 10 },
      { _id: daysKey(1), revenue: 62000, orders: 3 },
      { _id: daysKey(2), revenue: 0, orders: 0 },
      { _id: daysKey(3), revenue: 15000, orders: 2 },
      { _id: daysKey(4), revenue: 9000, orders: 1 },
      { _id: daysKey(5), revenue: 6000, orders: 1 },
      { _id: daysKey(6), revenue: 11000, orders: 2 },
    ],
    ordersByStatus: [
      { _id: "delivered", count: 5 },
      { _id: "processing", count: 4 },
      { _id: "shipped", count: 3 },
      { _id: "confirmed", count: 2 },
      { _id: "cancelled", count: 2 },
    ],
    topProducts: [
      { _id: "p1", name: "Wireless Headphones", image: null, totalSold: 45, revenue: 54000 },
      { _id: "p2", name: "Smart Watch", image: null, totalSold: 32, revenue: 80000 },
      { _id: "p3", name: "Bluetooth Speaker", image: null, totalSold: 28, revenue: 22400 },
      { _id: "p4", name: "Running Shoes", image: null, totalSold: 20, revenue: 30000 },
      { _id: "p5", name: "Yoga Mat", image: null, totalSold: 18, revenue: 6300 },
    ],
    recentOrders: ORDERS.slice(0, 5).map((order) => ({ ...order })),
    totalCustomers: 12,
  };
}

export const EMPTY_CART = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discountAmount: 0,
  total: 0,
  coupon: null,
};

// Build the shared cart payload shape (GET /carts and every mutation) from a
// list of line items so checkout specs can seed a realistic server cart.
export function createCart(items = []) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discountAmount: 0,
    total: subtotal,
    coupon: null,
  };
}

// Per-test mutable state controlling mock API behaviour.
export function createApiState(overrides = {}) {
  return {
    products: [...PRODUCTS],
    orders: [...ORDERS],
    users: [...USERS],
    carts: CARTS.map((cart) => ({ ...cart })),
    cart: { ...EMPTY_CART },
    dashboard: createDashboard(),
    delayMs: 0,
    productStatus: 200,
    orderStatus: 200,
    userStatus: 200,
    cartStatus: 200,
    authUser: ADMIN_USER,
    authStatus: 200,
    lastOrder: null,
    ...overrides,
  };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const json = async (res, body, delay = 0) => {
  if (delay > 0) await wait(delay);
  return res.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
};
const error = async (res, status, message, delay = 0) => {
  if (delay > 0) await wait(delay);
  return res.fulfill({ status, contentType: "application/json", body: JSON.stringify({ message }) });
};

export function installMockApi(page, state) {
  return page.route("**/api/**", async (route, request) => {
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    // Auth
    if (path.endsWith("/auth/me") && method === "GET") {
      if (state.authStatus !== 200)
        return error(route, state.authStatus, "Unauthorized", state.delayMs);
      if (!state.authUser)
        return error(route, 401, "Unauthorized", state.delayMs);
      return json(route, { user: state.authUser }, state.delayMs);
    }

    // Cart (mounted globally). The storefront reads the payload from the
    // response body directly, so return the cart object, not `{ cart }`.
    if (path === "/api/carts" && method === "GET")
      return json(route, state.cart, state.delayMs);

    if (path === "/api/carts/clear" && method === "DELETE") {
      state.cart = { ...EMPTY_CART };
      return json(route, state.cart, state.delayMs);
    }

    // ── Products ──────────────────────────────────────────────────────────
    if (path === "/api/products" && method === "GET") {
      if (state.productStatus !== 200)
        return error(route, state.productStatus, "Server error", state.delayMs);

      let items = state.products;
      const search = url.searchParams.get("search")?.toLowerCase();
      if (search)
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
            p.brand.toLowerCase().includes(search),
        );
      const category = url.searchParams.get("category")?.toLowerCase();
      if (category) items = items.filter((p) => p.category.toLowerCase() === category);
      const brand = url.searchParams.get("brand")?.toLowerCase();
      if (brand) items = items.filter((p) => p.brand.toLowerCase() === brand);
      const minPriceParam = url.searchParams.get("minPrice");
      if (minPriceParam && Number.isFinite(Number(minPriceParam)))
        items = items.filter((p) => p.price >= Number(minPriceParam));
      const maxPriceParam = url.searchParams.get("maxPrice");
      if (maxPriceParam && Number.isFinite(Number(maxPriceParam)))
        items = items.filter((p) => p.price <= Number(maxPriceParam));
      const sort = url.searchParams.get("sort");
      if (sort === "price_asc") items = [...items].sort((a, b) => a.price - b.price);
      if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
      if (sort === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name));

      const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 100);
      const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
      const totalPages = Math.max(1, Math.ceil(items.length / limit));
      const sliced = items.slice((page - 1) * limit, (page - 1) * limit + limit);

      return json(route, { products: sliced, total: items.length, totalPages }, state.delayMs);
    }

    const prodDelete = path.match(/^\/api\/products\/([^/]+)$/);
    if (prodDelete && method === "DELETE") {
      if (state.productStatus !== 200) return error(route, state.productStatus, "Server error", state.delayMs);
      state.products = state.products.filter((p) => p._id !== prodDelete[1]);
      return json(route, { message: "deleted" }, state.delayMs);
    }

    if (path === "/api/products" && method === "POST")
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ product: { _id: "new", ...(await request.postData() ? JSON.parse(request.postData()) : {}) } }) });

    // ── Orders ────────────────────────────────────────────────────────────
    if (path === "/api/orders/admin/dashboard" && method === "GET") {
      if (state.orderStatus !== 200)
        return error(route, state.orderStatus, "Server error", state.delayMs);
      return json(route, { dashboard: state.dashboard }, state.delayMs);
    }

    if (path === "/api/orders/admin/carts" && method === "GET") {
      if (state.cartStatus !== 200)
        return error(route, state.cartStatus, "Server error", state.delayMs);

      const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 100);
      const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
      const totalPages = Math.max(1, Math.ceil(state.carts.length / limit));
      const sliced = state.carts.slice((page - 1) * limit, (page - 1) * limit + limit);

      return json(
        route,
        { success: true, carts: sliced, total: state.carts.length, currentPage: page, totalPages },
        state.delayMs,
      );
    }

    if (path === "/api/orders/admin" && method === "GET") {
      if (state.orderStatus !== 200) return error(route, state.orderStatus, "Server error", state.delayMs);

      let items = state.orders;
      const status = url.searchParams.get("status");
      if (status && status !== "all") items = items.filter((o) => o.status === status);
      const paymentStatus = url.searchParams.get("paymentStatus");
      if (paymentStatus && paymentStatus !== "all") items = items.filter((o) => o.paymentStatus === paymentStatus);
      const sortBy = url.searchParams.get("sortBy");
      const sortDir = url.searchParams.get("sortDir") || "asc";
      if (sortBy) {
        items = [...items].sort((a, b) => {
          const av = a[sortBy]; const bv = b[sortBy];
          if (av < bv) return sortDir === "asc" ? -1 : 1;
          if (av > bv) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }

      const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 15, 1), 100);
      const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
      const totalPages = Math.max(1, Math.ceil(items.length / limit));
      const sliced = items.slice((page - 1) * limit, (page - 1) * limit + limit);

      return json(route, { orders: sliced, total: items.length, totalPages }, state.delayMs);
    }

    const orderStatusMatch = path.match(/^\/api\/orders\/admin\/([^/]+)\/status$/);
    if (orderStatusMatch && method === "PATCH") {
      if (state.orderStatus !== 200) return error(route, state.orderStatus, "Server error", state.delayMs);
      const body = JSON.parse(request.postData() || "{}");
      const order = state.orders.find((o) => o._id === orderStatusMatch[1]);
      if (order) { order.status = body.status || order.status; order.adminNote = body.adminNote ?? order.adminNote; }
      return json(route, { order }, state.delayMs);
    }

    // Customer checkout (POST /orders). Mirrors the real backend: creates the
    // order from the body and clears the signed-in user's cart server-side.
    if (path === "/api/orders" && method === "POST") {
      if (state.orderStatus !== 200)
        return error(route, state.orderStatus, "Server error", state.delayMs);

      const body = JSON.parse(request.postData() || "{}");
      const order = {
        _id: `ord-new-${Date.now()}`,
        ...body,
        status: "pending",
        paymentStatus: "pending",
        totalPrice: state.cart.total,
        createdAt: new Date().toISOString(),
      };
      state.orders.push(order);
      state.lastOrder = order;
      state.cart = { ...EMPTY_CART };

      return json(route, { success: true, message: "Order created", order }, state.delayMs);
    }

    // ── Users ─────────────────────────────────────────────────────────────
    if (path === "/api/users/all" && method === "GET") {
      if (state.userStatus !== 200) return error(route, state.userStatus, "Server error", state.delayMs);
      return json(route, { users: state.users }, state.delayMs);
    }
    if (path === "/api/users/add" && method === "POST") {
      const body = JSON.parse(request.postData() || "{}");
      const user = { _id: "new", username: body.username || "", email: body.email || "", role: body.role || "customer" };
      state.users.push(user);
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ user }) });
    }
    const userDelMatch = path.match(/^\/api\/users\/([^/]+)$/);
    if (userDelMatch && method === "DELETE") {
      if (state.userStatus !== 200) return error(route, state.userStatus, "Server error", state.delayMs);
      state.users = state.users.filter((u) => u._id !== userDelMatch[1]);
      return json(route, { message: "deleted" }, state.delayMs);
    }
    if (path.endsWith("/auth/change-role") && method === "PATCH") {
      const body = JSON.parse(request.postData() || "{}");
      const user = state.users.find((u) => u._id === body.userId);
      if (user) user.role = body.role;
      return json(route, { user });
    }

    // Fallback
    await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Not mocked" }) });
  });
}