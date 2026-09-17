import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { wishlistService } from "../services/wishlistService";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // استخدام useRef لمنع جلب البيانات أكثر من مرة بالخطأ عند الـ Mount
  const fetchedRef = useRef(false);

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getMyWishlist();
      
      // استخراج الـ Array بالشكل الصحيح بناءً على استجابة السيرفر
      let itemsList = [];
      if (Array.isArray(data)) {
        itemsList = data;
      } else if (data && data.wishlist && Array.isArray(data.wishlist.products)) {
        itemsList = data.wishlist.products;
      } else if (data && Array.isArray(data.wishlist)) {
        itemsList = data.wishlist;
      } else if (data && Array.isArray(data.items)) {
        itemsList = data.items;
      } else if (data && data.data && Array.isArray(data.data.items)) {
        itemsList = data.data.items;
      }

      setWishlistItems(itemsList);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wishlist");
      setWishlistItems([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  // جلب البيانات مرة واحدة عند التحميل باستخدام الـ ref لتجاوز تحذير الـ linter
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      loadWishlist();
    }
  }, [loadWishlist]);

  const addToWishlist = async (productId) => {
    try {
      setError(null);
      
      // 1. تحديث الحالة محلياً وفوراً لمنع اختفاء اللون أو العداد
      setWishlistItems((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const exists = list.some((item) => {
          const itemId = typeof item === "string" ? item : (item._id || item.id || item.product?._id || item.product);
          return itemId === productId;
        });
        if (exists) return list;
        return [...list, productId];
      });

      // 2. إرسال الطلب للسيرفر وتحديث القائمة فوراً بالبيانات الحقيقية الراجعة
      const response = await wishlistService.addToWishlist(productId);
      
      if (response && response.wishlist && Array.isArray(response.wishlist.products)) {
        setWishlistItems(response.wishlist.products);
      } else {
        await loadWishlist();
      }

      return response;
    } catch (err) {
      console.error("Add to wishlist error:", err);
      
      setWishlistItems((prev) => prev.filter(item => {
        const itemId = typeof item === "string" ? item : (item._id || item.id || item.product?._id || item.product);
        return itemId !== productId;
      }));
      
      const errorMessage = err.response?.data?.message || "Failed to add item to wishlist";
      setError(errorMessage);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setError(null);
      setWishlistItems((prev) => 
        Array.isArray(prev) ? prev.filter((item) => {
          const itemId = typeof item === "string" ? item : (item._id || item.id || item.product?._id || item.product);
          return itemId !== productId;
        }) : []
      );
      
      const response = await wishlistService.removeFromWishlist(productId);
      
      if (response && response.wishlist && Array.isArray(response.wishlist.products)) {
        setWishlistItems(response.wishlist.products);
      } else {
        await loadWishlist();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item");
      await loadWishlist();
      throw err;
    }
  };

  const clearWishlist = async () => {
    try {
      setError(null);
      setWishlistItems([]);
      await wishlistService.clearWishlist();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear wishlist");
      await loadWishlist();
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    if (!Array.isArray(wishlistItems) || !productId) return false;
    
    return wishlistItems.some((item) => {
      const itemId = typeof item === "string" ? item : (item._id || item.id || item.product?._id || item.product);
      return String(itemId) === String(productId);
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loding: loading,
        error,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// The hook is intentionally exported alongside the provider for the context API.
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};