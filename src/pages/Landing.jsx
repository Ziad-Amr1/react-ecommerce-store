import { TooltipProvider } from "@/components/ui/tooltip";
import LandingHero from "@/features/landing/components/LandingHero";
import FeaturedProducts from "@/features/landing/components/FeaturedProducts";
import Categories from "@/features/landing/components/Categories";
import PromotionalBanner from "@/features/landing/components/PromotionalBanner";
import Newsletter from "@/features/landing/components/Newsletter";

export default function Landing() {
  return (
    <TooltipProvider delayDuration={200}>
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <LandingHero />
        <FeaturedProducts />
        <Categories />
        <PromotionalBanner />
        <Newsletter />
      </main>
    </TooltipProvider>
  );
}