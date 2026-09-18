import { useTranslation } from "react-i18next";
import {
  Eye,
  Pencil,
  Trash2,
  UserRound,
  Users as UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import RowActionsMenu from "@/features/admin/components/RowActionsMenu";
import TableSkeletonRows from "@/features/admin/components/TableSkeletonRows";
import AdminTableEmptyState from "@/features/admin/components/AdminTableEmptyState";
import AdminTableFooter from "@/features/admin/components/AdminTableFooter";
import SortableTableHeader from "@/features/admin/components/SortableTableHeader";
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

export default function UsersTable({
  users,
  isLoading,
  sortKey,
  sortDirection,
  onSort,
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

  const columns = [
    { key: "username", label: t("users.columns.username"), sortable: true, sortKey: "username" },
    { key: "email", label: t("users.columns.email"), sortable: true, sortKey: "email" },
    { key: "role", label: t("users.columns.role"), sortable: true, sortKey: "role" },
    { key: "actions", label: t("users.columns.actions"), align: "end" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-border) bg-card shadow-sm">
      {isLoading ? (
        <Table edgePadding>
          <SortableTableHeader
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody>
            <TableSkeletonRows columns={4} />
          </TableBody>
        </Table>
      ) : users.length === 0 ? (
        <AdminTableEmptyState
          className="min-h-64 p-6 text-center"
          icon={
            <UsersIcon className="size-7 text-muted-foreground" aria-hidden="true" />
          }
          title={t("users.emptyTitle")}
          hint={t("users.emptyDescription")}
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <Table edgePadding className="min-w-[680px]">
            <SortableTableHeader
              columns={columns}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />

            <TableBody>
              {users.map((user) => {
                const isDeleting = deletingUserId === user._id;

                return (
                  <TableRow
                    key={user._id}
                    className="group transition-colors hover:bg-muted/50"
                  >
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => onView(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                          <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <span className="max-w-48 truncate font-medium text-foreground">
                          {user.username}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell
                      className="max-w-56 truncate text-muted-foreground cursor-pointer"
                      onClick={() => onView(user)}
                    >
                      {user.email}
                    </TableCell>

                    <TableCell
                      className="cursor-pointer"
                      onClick={() => onView(user)}
                    >
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="text-end">
                      <RowActionsMenu
                        disabled={isDeleting}
                        ariaLabel={t("users.columns.actions")}
                        onTriggerClick={(event) => event.stopPropagation()}
                        onCloseAutoFocus={(event) => event.preventDefault()}
                        items={[
                          {
                            icon: <Eye className="size-4" aria-hidden="true" />,
                            label: t("users.viewUser"),
                            onClick: () => onView(user),
                          },
                          {
                            icon: <Pencil className="size-4" aria-hidden="true" />,
                            label: t("users.editUser"),
                            onClick: () => onEdit(user),
                          },
                          {
                            icon: <Trash2 className="size-4" aria-hidden="true" />,
                            label: t("users.deleteUser", { name: user.username }),
                            onClick: () => onDelete(user),
                            variant: "destructive",
                            separator: true,
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <AdminTableFooter
              currentPage={currentPage}
              totalPages={totalPages}
              loading={false}
              onPageChange={onPageChange}
              labelPrefix="users.pagination"
              summary={{
                i18nKey: "users.pagination.showing",
                from: startIndex + 1,
                to: Math.min(totalUsers, startIndex + USERS_PER_PAGE),
                count: totalUsers,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}