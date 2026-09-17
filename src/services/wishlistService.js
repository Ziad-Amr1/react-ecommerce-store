import api from "@/api/axios";

export const wishlistService = {
  // 1. جلب قائمة الأمنيات الخاصة بالمستخدم
  getMyWishlist: async () => {
    const response = await api.get("/wishlists/my");
    return response.data;
  },

  // 2. إضافة منتج لمفضلة الأمنيات
  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlists/add/${productId}`);
    return response.data;
  },

  // 3. حذف منتج من مفضلة الأمنيات
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlists/remove/${productId}`);
    return response.data;
  },

  // 4. مسح كل قائمة الأمنيات
  clearWishlist: async () => {
    const response = await api.delete("/wishlists/clear");
    return response.data;
  },
};