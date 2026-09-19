import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Tag,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import useNotifications from "@/hooks/useNotifications";

const ICON_MAP = {
  Package,
  Tag,
  ShieldAlert,
  Sparkles,
};

export default function Notifications() {
  const { t } = useTranslation();
  const {
    notifications,
    unreadCount,
    toggleRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.read : true));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("notifications.title", "Notifications")}
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full text-xs">
                {unreadCount} {t("notifications.unread", "unread")}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t("notifications.description", "Stay updated with your latest order updates, offers, and account alerts.")}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="gap-1.5 rounded-xl cursor-pointer text-xs"
              >
                <CheckCheck className="size-3.5" />
                <span>{t("notifications.markAllRead", "Mark all as read")}</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="gap-1.5 rounded-xl cursor-pointer text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              <span>{t("notifications.clearAll", "Clear all")}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className={`rounded-xl text-xs cursor-pointer ${filter === "all" ? "font-semibold text-primary bg-primary/10" : ""}`}
          >
            {t("notifications.tabs.all", "All")} ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={`rounded-xl text-xs cursor-pointer ${filter === "unread" ? "font-semibold text-primary bg-primary/10" : ""}`}
          >
            {t("notifications.tabs.unread", "Unread")} ({unreadCount})
          </Button>
        </div>
      )}

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card className="rounded-2xl border">
          <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-accent/50 text-muted-foreground mb-4">
              <Bell className="size-7 opacity-60" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {t("notifications.empty", "No notifications yet")}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm">
              {t("notifications.emptyDescription", "When you receive order updates, promotions, or account security alerts, they will appear here.")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const IconComponent = (item.iconName && ICON_MAP[item.iconName]) || item.icon || Bell;
            return (
              <div
                key={item.id}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  !item.read
                    ? "bg-accent/30 border-primary/20 shadow-2xs"
                    : "bg-card border-border hover:bg-accent/10"
                }`}
              >
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  !item.read ? "bg-primary/15 text-primary" : "bg-accent text-muted-foreground"
                }`}>
                  <IconComponent className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm ${!item.read ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}>
                      {t(item.titleKey, item.defaultTitle)}
                    </h4>
                    <span className="text-xs text-muted-foreground shrink-0">{item.timestamp}</span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {t(item.descKey, item.defaultDesc)}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {item.link ? (
                      <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs font-semibold text-primary gap-1">
                        <Link to={item.link}>
                          <span>{t("common.viewDetails", "View details")}</span>
                          <ChevronRight className="size-3 rtl:rotate-180" />
                        </Link>
                      </Button>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRead(item.id)}
                        className="h-7 text-[11px] px-2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {item.read ? t("notifications.markUnread", "Mark unread") : t("notifications.markRead", "Mark read")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(item.id)}
                        className="h-7 text-[11px] px-2 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        {t("common.delete", "Delete")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
