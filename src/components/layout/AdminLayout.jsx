import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import brandLogo from "../../assets/brand-logo.png";
import { Button } from "@/components/ui/button";
import HeaderActionButtons from "../ui/HeaderActionButtons";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  function showSidebar() {
    setIsSidebarOpen(true);
  }
  function closeSidebar() {
    setIsSidebarOpen(false);
  }
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-overlay z-[calc(var(--z-nav)-1)] lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          {/* Start Mobile Header  */}
          <header className="flex items-center justify-evenly gap-4 border-b bg-surface p-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
              onClick={showSidebar}
            >
              <Menu size={20} aria-label="Open navigation menu" />
            </Button>
            {/* <h1 className="font-display font-semibold">Admin Panel</h1> */}
            <div className="flex items-center gap-3">
              <img
                src={brandLogo}
                alt="Borcelle Store"
                className="h-12 object-contain"
              />
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-text-primary)]">
                  Borcelle Dashboard
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  E-Commerce Admin Panel
                </p>
              </div>
            </div>
            <HeaderActionButtons />
          </header>
          {/* End Mobile Header  */}

          {/* Start Desktop Header  */}
          <header className="hidden lg:flex items-center justify-between border-b bg-surface px-6 py-3 sticky top-0 z-[var(--z-dropdown)]">
            <div className="flex items-center gap-3">
              <img
                src={brandLogo}
                alt="Borcelle Store"
                className="h-12 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-text-primary)]">
                  Borcelle Dashboard
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  E-Commerce Admin Panel
                </p>
              </div>
            </div>

            <HeaderActionButtons />
          </header>
          {/* End Desktop Header  */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
