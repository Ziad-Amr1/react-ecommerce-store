import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Package,
  Tag,
  ShieldAlert,
  Sparkles,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useNotifications from "@/hooks/useNotifications";
import { formatItemCount } from "@/features/cart/cartUtils";

const ICON_MAP = {
  Package,
  Tag,
  ShieldAlert,
  Sparkles,
};

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const previewList = notifications.slice(0, 4);

  const handleNotificationClick = (item) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative shrink-0 cursor-pointer rounded-full"
              aria-label={t("notifications.title", "Notifications")}
            >
              <Bell size={20} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="pointer-events-none absolute -top-1.5 -end-1.5 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background">
                  {formatItemCount(unreadCount)}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t("notifications.title", "Notifications")}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-80 sm:w-88 p-0 rounded-2xl shadow-xl border">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {t("notifications.title", "Notifications")}
            </span>
            {unreadCount > 0 && (
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-0">
                {unreadCount} {t("notifications.unread", "unread")}
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs text-muted-foreground hover:text-foreground px-2 cursor-pointer gap-1"
            >
              <CheckCheck className="size-3.5" />
              <span>{t("notifications.markAllRead", "Mark all read")}</span>
            </Button>
          )}
        </div>

        {/* Preview List */}
        <div className="max-h-80 overflow-y-auto divide-y">
          {previewList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                <Bell className="size-5 opacity-60" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium text-foreground">
                {t("notifications.empty", "No notifications yet")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
                {t("notifications.emptyDescription", "Updates will show here")}
              </p>
            </div>
          ) : (
            previewList.map((item) => {
              const IconComponent = ICON_MAP[item.iconName] || Bell;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full flex items-start gap-3 p-3 text-start transition-colors cursor-pointer hover:bg-accent/40 ${
                    !item.read ? "bg-accent/20" : ""
                  }`}
                >
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                    !item.read ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <IconComponent className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs truncate ${!item.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                        {t(item.titleKey, item.defaultTitle)}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {t(item.timeKey, { defaultValue: item.timestamp })}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                      {t(item.descKey, item.defaultDesc)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-muted/20">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-center text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 h-9 rounded-xl cursor-pointer gap-1"
          >
            <Link to="/notifications">
              <span>{t("notifications.viewAll", "View all notifications")}</span>
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
