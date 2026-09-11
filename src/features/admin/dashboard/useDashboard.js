import { useCallback, useEffect, useRef, useState } from "react";
import { getDashboard } from "./dashboard.service";

const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const fetchDashboard = useCallback(async () => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const data = await getDashboard(controller.signal);
      if (controller.signal.aborted) return;

      setDashboard(data.dashboard);
    } catch (err) {
      if (controller.signal.aborted) return;

      // Store a structured error: either a server message (already a string)
      // or a translation key the caller resolves.
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage ?? { key: "dashboard.loadError" });
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void fetchDashboard(), 0);

    return () => {
      clearTimeout(timer);
      controllerRef.current?.abort();
    };
  }, [fetchDashboard]);

  return { dashboard, loading, error, fetchDashboard };
};

export default useDashboard;