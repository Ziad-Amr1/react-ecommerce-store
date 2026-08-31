import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function TestLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="flex items-center gap-4 border-b bg-surface p-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <h1 className="font-display font-semibold">Admin Panel</h1>
      </header>

      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeSidebar}
            className="fixed inset-0 z-[calc(var(--z-nav)-1)] bg-overlay lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
