import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";

const SIDEBAR_ID = "admin-sidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function showSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeSidebar();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar id={SIDEBAR_ID} isOpen={isSidebarOpen} onClose={closeSidebar} />

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 bg-overlay z-[var(--z-dropdown)] lg:hidden cursor-pointer"
            onClick={closeSidebar}
          />
        )}

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <AdminHeader
            onMenuClick={showSidebar}
            sidebarOpen={isSidebarOpen}
            sidebarId={SIDEBAR_ID}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
