import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProfile , updateProfile } from "../api/profileApi";

export default function useProfile() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const fetchUser = useCallback(async (controller) => {
    try {
      const profile = await fetchProfile(controller.signal);

      if (controller.signal.aborted) return;

      setUser(profile);
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError" || controller.signal.aborted) return;

      setError(err);
      setStatus(err.status === 401 ? "unauthorized" : "error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    const startFetching = async () => {
      await fetchUser(controller);
    };

    startFetching();

    return () => {
      controller.abort();
      controllerRef.current = null;
    };
  }, [fetchUser]);

  const load = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setError(null);

    await fetchUser(controller);
  }, [fetchUser]);

const updateUser = useCallback(async (data) => {
  if (!user) {
    throw new Error("User not loaded");
  }

  const response = await updateProfile(user._id, data);

  const updatedUser = response.user ?? response;

  setUser(updatedUser);

  return updatedUser;
}, [user]);
  return {
    user,
    status,
    error,
    refetch: load,
    updateUser,
  };
}