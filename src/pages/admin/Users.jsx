import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "@/api/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ChevronLeft, ChevronRight, RefreshCw, Users as UsersIcon } from "lucide-react";
import { AddAdminDialog, DeleteConfirmDialog, UserDetailsDialog } from "./UserDialogs";

export default function Users(){
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch Users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try{
      const response = await api.get("/users/all");
      setUsers(response.data?.users || []);
      setCurrentPage(1);
    } catch (error){
      setUsers([]);
      setError(error.response?.data?.message || "Failed to load users. Please try again.");
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadUsers = async () => {
      try {
        const response = await api.get("/users/all");

        if(!ignore){
          setUsers(response.data?.users || []);
          setCurrentPage(1);
          setError(null);
        }
      } catch (error){
        if(!ignore){
          setUsers([]);
          setError(error.response?.data?.message || "Failed to load users. Please try again.");
        }
      } finally {
        if(!ignore){
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => { ignore = true; };
  }, []);
  
  // Pagination Calculations
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    if (totalPages <= 3){
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage === 1){
      return [1, 2, 3];
    }

    if (currentPage === totalPages){
      return [
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ];
  };

  const visiblePages = getVisiblePages();

  // Handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Loading State
  if (isLoading){
    return (
      <div className="space-y-6">
        <div>
          <h1 className="mb-1 text-3xl font-semibold text-[var(--color-text-primary)]">{t("Users Page")}</h1>
          <p className="text-[var(--color-text-secondary)]">Manage all users</p>
        </div>

        <div className="min-h-[280px] flex items-center justify-center rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
              <UsersIcon size={24} />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error){
    return (
      <div className="space-y-6">
        <div>
          <h1 className="mb-1 text-3xl font-semibold text-[var(--color-text-primary)]">{t("Users Page")}</h1>
          <p className="text-[var(--color-text-secondary)]">Manage all users</p>
        </div>

        <div className="min-h-[280px] flex flex-col items-center justify-center gap-4 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-bg)] p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-error)] text-[var(--color-surface)]">
            <RefreshCw size={22} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Unable to load users</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{error}</p>
          </div>
         <Button type="button" onClick={fetchUsers} className="bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-secondary)]">
            <RefreshCw size={17} />Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-semibold text-3xl text-[var(--color-text-primary)]">{t("Users Page")}</h1>
          <p className="text-[var(--color-text-secondary)]">Manage all users</p>
        </div>
        <Button onClick={() => setIsAddAdminOpen(true)} className="w-full bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-secondary)] sm:w-auto">
          <Plus size={18} />Add Admin
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-supporting)] bg-[var(--color-surface)]">
        {users.length === 0 ? (
          /* Empty State */
          <div className="min-h-[280px] flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
              <UsersIcon size={24} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">No users found.</h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">There are currently no users to display.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="border-b border-[var(--color-supporting)] bg-[var(--color-surface-secondary)]">
                    <TableHead className="text-[var(--color-text-primary)]">Username</TableHead>
                    <TableHead className="text-[var(--color-text-primary)]">Email</TableHead>
                    <TableHead className="text-[var(--color-text-primary)]">Role</TableHead>
                    <TableHead className="text-right text-[var(--color-text-primary)]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user._id} className="border-b border-[var(--color-supporting)] transition-colors hover:bg-[var(--color-surface-secondary)]">
                      <TableCell className="font-medium text-[var(--color-text-primary)]">{user.username}</TableCell>
                      <TableCell className="text-[var(--color-text-secondary)]">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "admin"
                              ? `
                                border
                                border-[var(--color-primary)]
                                bg-[var(--color-primary)]
                                text-[var(--color-surface)]
                              `
                              : `
                                border
                                border-[var(--color-supporting-decorative)]
                                bg-[var(--color-accent)]
                                text-[var(--color-on-accent)]
                              `
                          }
                        >{user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewUser(user)} className="border-[var(--color-supporting-decorative)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]hover:text-[var(--color-on-accent)]">View</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)} aria-label={`Delete ${user.username}`} className="bg-[var(--color-error)] text-[var(--color-surface)] hover:opacity-90"><Trash2 size={16} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-[var(--color-supporting)] bg-[var(--color-surface-secondary)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Page information */}
                <p className="text-center text-sm text-[var(--color-text-secondary)] sm:text-left">
                  Showing{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">{Math.min(endIndex, users.length)}</span>{" "}
                  of{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">{users.length}</span>{" "}
                  users
                </p>

                {/* Page Controls */}
                <nav aria-label="Users pagination" className="flex items-center justify-center gap-1">
                  {/* Previous */}
                  <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1} aria-label="Previous page"
                    className="border-[var(--color-supporting-decorative)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] disabled:pointer-events-none disabled:opacity-50">
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </Button>

                  {/* Only 3 page numbers */}
                  {visiblePages.map((pageNumber) => {
                    const isActive =
                      currentPage === pageNumber;

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          isActive ? "default" : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          setCurrentPage(pageNumber)
                        }
                        aria-current={
                          isActive ? "page" : undefined
                        }
                        aria-label={`Go to page ${pageNumber}`}
                        className={
                          isActive
                            ? `
                              bg-[var(--color-primary)]
                              text-[var(--color-surface)]
                              hover:bg-[var(--color-secondary)]
                            `
                            : `
                              border-[var(--color-supporting-decorative)]
                              text-[var(--color-text-primary)]
                              hover:bg-[var(--color-accent)]
                              hover:text-[var(--color-on-accent)]
                            `
                        }
                      >{pageNumber}
                      </Button>
                    );
                  })}

                  {/* Next */}
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Next page"
                    className="border-[var(--color-supporting-decorative)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] disabled:pointer-events-none disabled:opacity-50">
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <AddAdminDialog isOpen={isAddAdminOpen} onClose={() => setIsAddAdminOpen(false)} onSuccess={fetchUsers}/>
      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} user={selectedUser} onSuccess={fetchUsers}/>
      <UserDetailsDialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} user={selectedUser}/>
    </div>
  );
}