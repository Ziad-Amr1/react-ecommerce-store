import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { USERS_PER_PAGE } from "./constants";
import { deleteUser, getUsers } from "./users.service";

export default function useUsers() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const controllerRef = useRef(null);

  const fetchUsers = useCallback(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    getUsers(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setUsers(Array.isArray(data) ? data : []);
        setLoadError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setLoadError(error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchUsers();

    return () => controllerRef.current?.abort();
  }, [fetchUsers, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

  const retry = () => {
    setLoadError(null);
    setIsLoading(true);
    setCurrentPage(1);
    setReloadKey((key) => key + 1);
  };

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page < 1) {
      return;
    }
    setCurrentPage(page);
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
      if (!user || deletingUserId) {
        return;
      }

      setUserToDelete(null);
      setDeletingUserId(user._id);

      try {
        await deleteUser(user._id);
        toast.success(t("users.dialogs.deleteSuccess"));

        // Always reload so the deleted user cannot linger in the cached list;
        // roll the page back only when it would otherwise become empty.
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        }
        setReloadKey((key) => key + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || t("users.dialogs.deleteFailed"));
      } finally {
        setDeletingUserId(null);
      }
    },
    [currentPage, deletingUserId, t, users.length],
  );

  return {
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
    handleCloseAdd: () => setIsAddOpen(false),
    retry,
    reload,
  };
}