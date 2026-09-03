import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  function showSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="overflow-hidden">
      <AdminHeader onMenuClick={showSidebar} />

      <div className="flex">
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-overlay z-[var(--z-dropdown)] lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </div>
    </div>
  );
}
