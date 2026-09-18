import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { USERS_PER_PAGE } from "./constants";
import { deleteUser, getUsers } from "./users.service";

// The users admin API (`GET /users/all`) returns the FULL dataset with no
// server-side search/sort/filter/pagination parameters. Unlike Products and
// Orders (which use the shared `useAdminServerTable` for server-paged rows),
// Users therefore derives filtering/sorting/paging client-side over the fetched
// array. UI stays consistent by reusing the same shared components
// (SortableTableHeader, AdminTableFooter, etc.) — only the data plumbing differs.
export default function useUsers() {
  const { t } = useTranslation();

  // ── Raw data ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const controllerRef = useRef(null);

  // ── Client-side filter / sort state ─────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Details / edit / delete sheet state (unchanged) ─────────────────────
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // ── Fetch all users ─────────────────────────────────────────────────────
  const fetchUsers = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getUsers(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setUsers(Array.isArray(data) ? data : []);
        setLoadError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUsers();
    return () => controllerRef.current?.abort();
  }, [fetchUsers, reloadKey]);

  // ── Derived: filtered + sorted list ─────────────────────────────────────
  const filteredSortedUsers = useMemo(() => {
    let list = [...users];

    // Role filter
    if (roleFilter && roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    // Search filter (username or email)
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(
        (u) =>
          (u.username && u.username.toLowerCase().includes(term)) ||
          (u.email && u.email.toLowerCase().includes(term)),
      );
    }

    // Sort
    if (sortKey) {
      list.sort((a, b) => {
        const av = (a[sortKey] ?? "").toString().toLowerCase();
        const bv = (b[sortKey] ?? "").toString().toLowerCase();
        if (av < bv) return sortDirection === "asc" ? -1 : 1;
        if (av > bv) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [users, roleFilter, searchTerm, sortKey, sortDirection]);

  // ── Derived: pagination ─────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredSortedUsers.length / USERS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;
  const currentUsers = filteredSortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  // ── Sort toggle ─────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    },
    [sortKey],
  );

  // ── Pagination ──────────────────────────────────────────────────────────
  const handlePageChange = useCallback((page) => {
    if (typeof page !== "number" || !Number.isFinite(page) || page < 1) return;
    setCurrentPage(page);
  }, []);

  // ── Detail / edit / delete handlers (unchanged) ─────────────────────────
  const retry = useCallback(() => {
    setLoadError(null);
    setIsLoading(true);
    setCurrentPage(1);
    setReloadKey((key) => key + 1);
  }, []);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const handleView = useCallback((user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const handleDelete = useCallback(
    async (user) => {
      if (!user || deletingUserId) return;

      setUserToDelete(null);
      setDeletingUserId(user._id);

      try {
        await deleteUser(user._id);
        toast.success(t("users.dialogs.deleteSuccess"));

        if (users.length === 1 && safeCurrentPage > 1) {
          setCurrentPage((page) => page - 1);
        }
        setReloadKey((key) => key + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || t("users.dialogs.deleteFailed"));
      } finally {
        setDeletingUserId(null);
      }
    },
    [safeCurrentPage, deletingUserId, t, users.length],
  );

  return {
    // Raw data
    users,
    isLoading,
    loadError,

    // Filtered / sorted list (for display + statistics)
    filteredSortedUsers,

    // Current page slice
    currentUsers,
    totalPages,
    currentPage: safeCurrentPage,
    startIndex,

    // Search / sort / filter state
    searchTerm,
    handleSearchChange,
    roleFilter,
    handleRoleFilterChange,
    sortKey,
    sortDirection,
    handleSort,

    // Pagination
    handlePageChange,

    // Details / edit / delete
    selectedUser,
    isDetailsOpen,
    editingUser,
    isEditOpen,
    userToDelete,
    deletingUserId,
    isAddOpen,
    handleView,
    handleCloseDetails,
    handleEdit,
    handleCloseEdit,
    handleDelete,
    setUserToDelete,
    setIsAddOpen,
    handleCloseAdd: () => setIsAddOpen(false),
    retry,
    reload,
  };
}
