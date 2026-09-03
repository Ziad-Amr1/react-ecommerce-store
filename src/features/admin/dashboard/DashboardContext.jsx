import { createContext, useContext, useState } from "react";
import { getDashboard } from "./dashboard.service";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboard();
      setDashboard(data.dashboard);
    } catch (err) {
      setError("Unable to load dashboard data.");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{ dashboard, loading, error, fetchDashboard }}
    >
      {" "}
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext);
};
