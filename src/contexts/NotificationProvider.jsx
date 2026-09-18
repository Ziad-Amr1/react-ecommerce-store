import { useState, useEffect } from "react";
import NotificationContext from "./NotificationContext";

const STORAGE_KEY = "store_notifications_v1";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "order",
    iconName: "Package",
    titleKey: "notifications.items.orderShipped",
    descKey: "notifications.items.orderShippedDesc",
    defaultTitle: "Order Shipped",
    defaultDesc: "Order #ORD-8921 has been shipped and is on its way!",
    timeKey: "notifications.items.orderShippedTime",
    timestamp: "2 hours ago",
    read: false,
    link: "/my-orders",
  },
  {
    id: "notif-2",
    type: "promo",
    iconName: "Tag",
    titleKey: "notifications.items.saleAlert",
    descKey: "notifications.items.saleAlertDesc",
    defaultTitle: "Spring Sale Offer",
    defaultDesc: "Enjoy up to 30% off on all Electronics items today!",
    timeKey: "notifications.items.saleAlertTime",
    timestamp: "5 hours ago",
    read: false,
    link: "/products",
  },
  {
    id: "notif-3",
    type: "security",
    iconName: "ShieldAlert",
    titleKey: "notifications.items.securityAlert",
    descKey: "notifications.items.securityAlertDesc",
    defaultTitle: "Security Alert",
    defaultDesc: "Your account password was successfully updated.",
    timeKey: "notifications.items.securityAlertTime",
    timestamp: "1 day ago",
    read: true,
    link: "/profile",
  },
  {
    id: "notif-4",
    type: "welcome",
    iconName: "Sparkles",
    titleKey: "notifications.items.welcome",
    descKey: "notifications.items.welcomeDesc",
    defaultTitle: "Welcome Bonus",
    defaultDesc: "Welcome to our store! Enjoy free shipping on your first order.",
    timeKey: "notifications.items.welcomeTime",
    timestamp: "3 days ago",
    read: true,
    link: "/products",
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore storage errors
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        toggleRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
