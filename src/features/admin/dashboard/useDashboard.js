import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDashboard } from "./dashboard.service";

const useDashboard = () => {
  const { t } = useTranslation();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboard();
      setDashboard(data.dashboard);
    } catch (err) {
      setError(
        err?.response?.data?.message || t("dashboard.loadError"),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { dashboard, loading, error, fetchDashboard };
};

export default useDashboard;
