import { Outlet } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";

export default function StoreLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <main id="main-content" className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <StoreFooter />
      </div>
    </TooltipProvider>
  );
}