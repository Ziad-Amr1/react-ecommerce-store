import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, RefreshCw, Search, ShieldCheck, UserCheck, Users as UsersIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/utils/formatNumber";
import useUsers from "@/features/admin/users/useUsers";
import UsersTable from "@/features/admin/users/components/UsersTable";
import AddAdminDialog from "@/features/admin/users/components/AddAdminDialog";
import EditUserDialog from "@/features/admin/users/components/EditUserDialog";
import DeleteUserDialog from "@/features/admin/users/components/DeleteUserDialog";
import UserDetailsDialog from "@/features/admin/users/components/UserDetailsDialog";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminErrorState from "@/features/admin/components/AdminErrorState";
import StatCard from "@/features/admin/dashboard/components/StatCard";

export default function Users() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en-US";

  const {
    currentUsers,
    filteredSortedUsers,
    totalPages,
    currentPage,
    isLoading,
    loadError,
    searchTerm,
    handleSearchChange,
    roleFilter,
    handleRoleFilterChange,
    sortKey,
    sortDirection,
    handleSort,
    selectedUser,
    isDetailsOpen,
    editingUser,
    isEditOpen,
    userToDelete,
    deletingUserId,
    isAddOpen,
    startIndex,
    handlePageChange,
    handleView,
    handleCloseDetails,
    handleEdit,
    handleCloseEdit,
    handleDelete,
    setUserToDelete,
    setIsAddOpen,
    retry,
    reload,
  } = useUsers();

  const customerCount = useMemo(
    () => filteredSortedUsers.filter((u) => u?.role === "customer").length,
    [filteredSortedUsers],
  );
  const adminCount = useMemo(
    () => filteredSortedUsers.filter((u) => u?.role === "admin").length,
    [filteredSortedUsers],
  );

  const kpis = [
    {
      id: "total",
      title: t("users.kpis.totalUsers", { defaultValue: "Total Users" }),
      description: t("users.kpis.totalUsersDesc", { defaultValue: "All registered accounts" }),
      value: formatNumber(filteredSortedUsers.length, locale),
      icon: UsersIcon,
    },
    {
      id: "customers",
      title: t("users.kpis.customers", { defaultValue: "Customers" }),
      description: t("users.kpis.customersDesc", { defaultValue: "Standard store shoppers" }),
      value: formatNumber(customerCount, locale),
      icon: UserCheck,
    },
    {
      id: "admins",
      title: t("users.kpis.admins", { defaultValue: "Administrators" }),
      description: t("users.kpis.adminsDesc", { defaultValue: "Privileged admin roles" }),
      value: formatNumber(adminCount, locale),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker={t("users.subtitle", { defaultValue: "Account Governance" })}
        title={t("users.title")}
        description={t("users.description", { defaultValue: "Manage registered user accounts, system roles, and customer access." })}
        action={
          <Button
            onClick={() => setIsAddOpen(true)}
            className="w-full cursor-pointer sm:w-auto gap-2"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("users.addUser")}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            icon={kpi.icon}
            className="gap-0 py-4"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={t("users.searchPlaceholder")}
            aria-label={t("users.searchPlaceholder")}
            className="ps-9"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleSearchChange("")}
              aria-label={t("users.clearSearch")}
              className="absolute end-1.5 top-1/2 size-7 -translate-y-1/2"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-full sm:w-48" aria-label={t("users.roleFilter")}>
            <SelectValue placeholder={t("users.roleFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("users.roleFilterAll")}</SelectItem>
            <SelectItem value="admin">{t("users.roles.admin")}</SelectItem>
            <SelectItem value="customer">{t("users.roles.customer")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loadError && !isLoading ? (
        <AdminErrorState
          title={t("users.loadErrorTitle")}
          hint={t("users.loadError")}
          onRetry={retry}
          retryLabel={t("users.retry")}
          retryIcon={<RefreshCw className="size-4" aria-hidden="true" />}
          className="rounded-xl border border-(--color-error) bg-(--color-error-bg)"
          iconClassName="bg-(--color-error) text-(--color-surface)"
        />
      ) : (
        <UsersTable
          users={currentUsers}
          isLoading={isLoading}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={filteredSortedUsers.length}
          startIndex={startIndex}
          deletingUserId={deletingUserId}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={setUserToDelete}
          onPageChange={handlePageChange}
        />
      )}

      <AddAdminDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={reload}
      />

      <EditUserDialog
        key={editingUser?._id ?? "none"}
        user={editingUser}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSuccess={reload}
      />

      <DeleteUserDialog
        userToDelete={userToDelete}
        deletingUserId={deletingUserId}
        onClose={() => setUserToDelete(null)}
        onDelete={() => handleDelete(userToDelete)}
      />

      <UserDetailsDialog
        user={selectedUser}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}