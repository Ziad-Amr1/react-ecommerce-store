import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDashboard } from "./dashboard.service";

const useDashboard = () => {
  const { t } = useTranslation();

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

      if (controller.signal.aborted) {
        return;
      }

      setDashboard(data.dashboard);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || t("dashboard.loadError"));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    // Defer the initial fetch out of the synchronous effect body so the
    // fetch's setState calls run after the first render (react-hooks v7).
    const timer = setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => {
      clearTimeout(timer);
      controllerRef.current?.abort();
    };
  }, [fetchDashboard]);

  return { dashboard, loading, error, fetchDashboard };
};

export default useDashboard;