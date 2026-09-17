import { useTranslation } from "react-i18next";
import { Plus, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUsers from "@/features/admin/users/useUsers";
import UsersTable from "@/features/admin/users/components/UsersTable";
import AddAdminDialog from "@/features/admin/users/components/AddAdminDialog";
import EditUserDialog from "@/features/admin/users/components/EditUserDialog";
import DeleteUserDialog from "@/features/admin/users/components/DeleteUserDialog";
import UserDetailsDialog from "@/features/admin/users/components/UserDetailsDialog";

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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("users.subtitle")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            {t("users.title")}
          </h1>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="w-full cursor-pointer sm:w-auto"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t("users.addUser")}
        </Button>
      </div>

      {loadError && !isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-error bg-error-bg px-4 py-14 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-error text-surface">
            <TriangleAlert className="size-7" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("users.loadErrorTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("users.loadError")}</p>
          <Button className="mt-2 cursor-pointer" onClick={retry}>
            <RefreshCw className="size-4" aria-hidden="true" />
            {t("users.retry")}
          </Button>
        </div>
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