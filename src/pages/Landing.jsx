import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO/SEO";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingHero from "@/features/landing/components/LandingHero";
import FeaturedProducts from "@/features/landing/components/FeaturedProducts";
import Categories from "@/features/landing/components/Categories";
import PromotionalBanner from "@/features/landing/components/PromotionalBanner";
import Newsletter from "@/features/landing/components/Newsletter";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <TooltipProvider delayDuration={200}>
      <SEO
        title={t("home.title")}
        description={t("home.description")}
        url="/"
      />
      <div className="pb-16">
        <LandingHero />
        <FeaturedProducts />
        <Categories />
        <PromotionalBanner />
        <Newsletter />
      </div>
    </TooltipProvider>
  );
}