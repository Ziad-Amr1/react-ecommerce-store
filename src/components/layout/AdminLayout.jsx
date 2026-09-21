import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import SEO from "@/components/SEO/SEO";

const SIDEBAR_ID = "admin-sidebar";
const COLLAPSE_STORAGE_KEY = "admin-sidebar-collapsed";

function getInitialCollapsed() {
  return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
}

export default function AdminLayout() {
  const { t } = useTranslation();
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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("navigation.adminPanel", "Admin Panel")}
        description={t(
          "navigation.adminDescription",
          "Manage products, orders, and customers on the Oversea Store dashboard.",
        )}
        noindex
      />
      <div className="flex min-h-screen">
        <Sidebar
          id={SIDEBAR_ID}
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={closeSidebar}
          onToggleCollapse={toggleCollapse}
        />

        <main
          className={`min-w-0 flex-1 transition-[padding] duration-300 ease-out ${
            isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
          }`}
        >
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
