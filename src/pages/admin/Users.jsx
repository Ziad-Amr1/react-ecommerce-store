import { useTranslation } from "react-i18next";
import { Plus, RefreshCw, TriangleAlert , Users as UsersIcon} from "lucide-react";
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

  const isEmpty = !isLoading && !loadError && users.length === 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* header */}
      <div className="flex flex-col sm-items-center sm:justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("users.subtitle" ,"Management")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            {t("users.title" , "User Management")}
          </h1>
        </div>
        <div className="flex items-center gap-2" >
        <Button
          variant="outline"
          size="icon"
          onClick={reload}
          disabled={isLoading}  
          title={t("users.reload" ,"Reload Users")}
          className="cursor-pointer"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
        </Button>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="w-full cursor-pointer sm:w-auto"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t("users.addUser" , "Add New User")}
        </Button>
        </div>
      </div>
      
      {/* error state */}
      {loadError && !isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-14 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/20 text-destructive">
            <TriangleAlert className="size-7" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("users.loadErrorTitle" , "Failed to Load Users")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("users.loadError" ,"Someting went wrong while fetching data.")}</p>
          <Button className="mt-2 cursor-pointer" onClick={retry}>
            <RefreshCw className="size-4" aria-hidden="true" />
            {t("users.retry" , "Try Again")}
          </Button>
        </div>
      ) : isEmpty ?(
        // Empty state
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-4 py-14 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UsersIcon className="size-7" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("users.noUsersTitle", "No Users Found")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("users.noUsersDescription", "There are no users registered in the system yet.")}
          </p>
          <Button onClick={() => setIsAddOpen(true)} className="mt-2 cursor-pointer">
            <Plus className="size-4" aria-hidden="true" />
            {t("users.addUser", "Add First User")}
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
          {/* modals */}
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