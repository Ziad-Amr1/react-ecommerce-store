import { useTranslation } from "react-i18next";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUsers from "@/features/admin/users/useUsers";
import UsersTable from "@/features/admin/users/components/UsersTable";
import AddAdminDialog from "@/features/admin/users/components/AddAdminDialog";
import EditUserDialog from "@/features/admin/users/components/EditUserDialog";
import DeleteUserDialog from "@/features/admin/users/components/DeleteUserDialog";
import UserDetailsDialog from "@/features/admin/users/components/UserDetailsDialog";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminErrorState from "@/features/admin/components/AdminErrorState";

export default function Users() {
  const { t } = useTranslation();

  const {
    users,
    currentUsers,
    totalPages,
    currentPage,
    isLoading,
    loadError,
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        kicker={t("users.subtitle")}
        title={t("users.title")}
        action={
          <Button
            onClick={() => setIsAddOpen(true)}
            className="w-full cursor-pointer sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("users.addUser")}
          </Button>
        }
      />

      {loadError && !isLoading ? (
        <AdminErrorState
          title={t("users.loadErrorTitle")}
          hint={t("users.loadError")}
          onRetry={retry}
          retryLabel={t("users.retry")}
          retryIcon={<RefreshCw className="size-4" aria-hidden="true" />}
          className="rounded-xl border border-error bg-error-bg"
          iconClassName="bg-error text-surface"
        />
      ) : (
        <UsersTable
          users={currentUsers}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={users.length}
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