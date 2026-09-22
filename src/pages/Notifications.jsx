import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  Bell,
  CheckCheck,
  RotateCcw,
  Trash2,
  Package,
  Tag,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import AccountPageHeader from "@/components/layout/AccountPageHeader";
import useNotifications from "@/hooks/useNotifications";
import SEO from "@/components/SEO/SEO";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isClearOpen, setIsClearOpen] = useState(false);

  const filtered = notifications.filter((n) =>
    filter === "unread" ? !n.read : true,
  );

  return (
    <div className="mx-auto max-w-4xl py-8 space-y-6">
      <SEO
        title={t("notifications.title", "Notifications")}
        description={t(
          "notifications.description",
          "Stay updated with your latest order updates, offers, and account alerts.",
        )}
        url="/notifications"
        noindex
      />
      <AccountPageHeader
        title={t("notifications.title", "Notifications")}
        description={t(
          "notifications.description",
          "Stay updated with your latest order updates, offers, and account alerts.",
        )}
        count={unreadCount > 0 ? unreadCount : undefined}
        actions={
          notifications.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-1.5 rounded-xl cursor-pointer text-xs"
                >
                  <CheckCheck className="size-3.5" />
                  <span>
                    {t("notifications.markAllRead", "Mark all as read")}
                  </span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsClearOpen(true)}
                className="gap-1.5 rounded-xl cursor-pointer text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                <span>{t("notifications.clearAll", "Clear all")}</span>
              </Button>
            </div>
          ) : null
        }
      />

      {/* Filters Bar */}
      {notifications.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
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
        <Empty className="border border-dashed bg-card p-8 sm:p-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell className="size-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              {t("notifications.empty", "No notifications yet")}
            </EmptyTitle>
            <EmptyDescription>
              {t(
                "notifications.emptyDescription",
                "When you receive order updates, promotions, or account security alerts, they will appear here.",
              )}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const IconComponent =
              (item.iconName && ICON_MAP[item.iconName]) || item.icon || Bell;
            return (
              <div
                key={item.id}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  !item.read
                    ? "bg-accent/30 border-primary/20 shadow-2xs"
                    : "bg-card border-border hover:bg-accent/10"
                }`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    !item.read
                      ? "bg-primary/15 text-primary"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  <IconComponent className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm ${!item.read ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}
                    >
                      {t(item.titleKey, item.defaultTitle)}
                    </h4>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {t(item.descKey, item.defaultDesc)}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {item.link ? (
                      <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs font-semibold text-primary gap-1"
                      >
                        <Link to={item.link}>
                          <span>{t("common.viewDetails", "View details")}</span>
                          <ChevronRight className="size-3 rtl:rotate-180" />
                        </Link>
                      </Button>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleRead(item.id)}
                            aria-label={
                              item.read
                                ? t("notifications.markUnread", "Mark unread")
                                : t("notifications.markRead", "Mark read")
                            }
                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {item.read ? (
                              <RotateCcw
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <CheckCheck
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {item.read
                            ? t("notifications.markUnread", "Mark unread")
                            : t("notifications.markRead", "Mark read")}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPendingDelete(item)}
                            aria-label={t("common.delete", "Delete")}
                            className="size-7 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {t("common.delete", "Delete")}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete notification confirmation */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-(--color-error-bg) text-(--color-error)">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="font-display">
              {t("notifications.deleteTitle", "Delete notification?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "notifications.deleteDescription",
                "This notification will be permanently removed. This action can't be undone.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                pendingDelete && deleteNotification(pendingDelete.id)
              }
            >
              {t("notifications.deleteConfirm", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all notifications confirmation */}
      <AlertDialog
        open={isClearOpen}
        onOpenChange={(open) => !open && setIsClearOpen(false)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-(--color-error-bg) text-(--color-error)">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="font-display">
              {t("notifications.clearAllTitle", "Clear all notifications?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "notifications.clearAllDescription",
                "All notifications will be permanently removed. This action can't be undone.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={clearAll}>
              {t("notifications.clearAllConfirm", "Clear all")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
