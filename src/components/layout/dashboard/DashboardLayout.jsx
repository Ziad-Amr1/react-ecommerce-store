import { Outlet } from "react-router";
import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  function showSidebar() {
    setIsSidebarOpen(true);
  }
  function closeSidebar() {
    setIsSidebarOpen(false);
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={closeSidebar}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-overlay z-[var(--z-dropdown)] lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <main className="min-w-0 flex-1 ">
          <DashboardHeader onMenuClick={showSidebar} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
