import { Outlet } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";

export default function StoreLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <div className="flex-1">
          <Outlet />
        </div>
        <StoreFooter />
      </div>
    </TooltipProvider>
  );
}