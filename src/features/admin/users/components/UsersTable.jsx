import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
  Users as UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USERS_PER_PAGE } from "../constants";

function RoleBadge({ role }) {
  const { t } = useTranslation();
  const isAdmin = role === "admin";

  return (
    <Badge
      variant="outline"
      className={`border-transparent ${
        isAdmin
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {t(`users.roles.${role}`, { defaultValue: role })}
    </Badge>
  );
}

function SkeletonRows({ columns }) {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <TableCell key={columnIndex}>
          <div className="h-4 animate-pulse rounded-md bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function UsersPagination({
  currentPage,
  totalPages,
  startIndex,
  totalUsers,
  onPageChange,
}) {
  const { t } = useTranslation();

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (currentPage === 1) {
      return [1, 2, 3];
    }
    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col gap-4 border-t bg-muted/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-sm text-muted-foreground sm:text-start">
        {t("users.pagination.showing", {
          from: startIndex + 1,
          to: Math.min(startIndex + USERS_PER_PAGE, totalUsers),
          count: totalUsers,
        })}
      </p>

      <nav
        aria-label={t("users.pagination.label")}
        className="flex items-center justify-center gap-1"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={t("users.pagination.previousLabel")}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          <span className="hidden sm:inline">{t("users.pagination.previous")}</span>
        </Button>

        {visiblePages.map((pageNumber) => {
          const isActive = currentPage === pageNumber;

          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              aria-label={t("users.pagination.goToPage", { page: pageNumber })}
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "cursor-pointer" : "cursor-pointer"}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={t("users.pagination.nextLabel")}
        >
          <span className="hidden sm:inline">{t("users.pagination.next")}</span>
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}

export default function UsersTable({
  users,
  isLoading,
  currentPage,
  totalPages,
  totalUsers,
  startIndex,
  deletingUserId,
  onView,
  onEdit,
  onDelete,
  onPageChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-border) bg-card shadow-sm">
      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("users.columns.username")}</TableHead>
              <TableHead>{t("users.columns.email")}</TableHead>
              <TableHead>{t("users.columns.role")}</TableHead>
              <TableHead className="text-end">{t("users.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows columns={4} />
          </TableBody>
        </Table>
      ) : users.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <UsersIcon className="size-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-foreground">{t("users.emptyTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("users.emptyDescription")}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("users.columns.username")}</TableHead>
                <TableHead>{t("users.columns.email")}</TableHead>
                <TableHead>{t("users.columns.role")}</TableHead>
                <TableHead className="text-end">{t("users.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const isDeleting = deletingUserId === user._id;

                return (
                  <TableRow
                    key={user._id}
                    className="group cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => onView(user)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                          <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <span className="max-w-48 truncate font-medium text-foreground">
                          {user.username}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-56 truncate text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="text-end">
                      <div className="flex justify-end">
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={isDeleting}
                                aria-label={t("users.columns.actions")}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <MoreHorizontal className="size-4" aria-hidden="true" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onCloseAutoFocus={(event) => event.preventDefault()}>
                              <DropdownMenuItem onClick={() => onView(user)}>
                                <Eye className="size-4" aria-hidden="true" />
                                {t("users.viewUser")}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => onEdit(user)}>
                                <Pencil className="size-4" aria-hidden="true" />
                                {t("users.editUser")}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(user)}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                                {t("users.deleteUser")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <UsersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalUsers={totalUsers}
              startIndex={startIndex}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}