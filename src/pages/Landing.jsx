import Hero from "@/components/layout/Hero";
import FeaturedProducts from "@/components/layout/FeaturedProducts";
import Categories from "@/components/layout/Categories";
import PromotionalBanner from "@/components/layout/PromotionalBanner";
import Newsletter from "@/components/layout/Newsletter";

function Landing() {
  return (
    <div className="bg-[var(--color-background)]">
      <main className="w-[90%] mx-auto ">
        <Hero />
        <FeaturedProducts />
        <Categories />
        <PromotionalBanner />
        <Newsletter />
      </main>
    </div>
  );
}
export default Landing;
