import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useState } from "react";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  function showSidebar() {
    setIsSidebarOpen(true);
  }
  function closeSidebar() {
    setIsSidebarOpen(false);
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-overlay z-[var(--z-dropdown)] lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <AdminHeader onMenuClick={showSidebar} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
