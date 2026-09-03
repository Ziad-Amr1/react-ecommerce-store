import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";

const SIDEBAR_ID = "admin-sidebar";
const COLLAPSE_STORAGE_KEY = "admin-sidebar-collapsed";

function getInitialCollapsed() {
  return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
}

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    getInitialCollapsed(),
  );

  function showSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  function toggleCollapse() {
    setIsSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
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
        <Sidebar
          id={SIDEBAR_ID}
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={closeSidebar}
          onToggleCollapse={toggleCollapse}
        />

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 bg-overlay z-[var(--z-dropdown)] lg:hidden cursor-pointer"
            onClick={closeSidebar}
          />
        )}

        <main className="min-w-0 flex-1">
          <AdminHeader
            onMenuClick={showSidebar}
            sidebarOpen={isSidebarOpen}
            sidebarId={SIDEBAR_ID}
          />
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
