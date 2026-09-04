import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardContext from "./DashboardContext";
import { getDashboard } from "./dashboard.service";

export const DashboardProvider = ({ children }) => {
  const { t } = useTranslation();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboard();
      console.log("DASHBOARD RESPONSE:", data);
console.log("TOP PRODUCTS:", data.dashboard?.topProducts);
console.log(
  "FIRST TOP PRODUCT:",
  data.dashboard?.topProducts?.[0]
);

      setDashboard(data.dashboard);
    } catch (err) {
      setError(
        err?.response?.data?.message || t("dashboard.loadError"),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  return (
    <DashboardContext.Provider
      value={{ dashboard, loading, error, fetchDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

