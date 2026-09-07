import {
  PackageSearch,
  BanknoteArrowDown,
  ShieldCheck,
  Headset,
} from "lucide-react";
import HeroImage from "../../../public/hero.webp";
import { Button } from "@/components/ui/button";
import ProsCard from "../ui/ProsCard";

const prosItems = [
  {
    id: 0,
    icon: <PackageSearch className="size-8 text-[var(--color-secondary)]" />,
    title: "product variety",
    desc: "meet all your needs",
  },
  {
    id: 1,
    icon: (
      <BanknoteArrowDown className="size-8 text-[var(--color-secondary)]" />
    ),
    title: "easy returns",
    desc: "30-day return policy",
  },
  {
    id: 2,
    icon: <ShieldCheck className="size-8 text-[var(--color-secondary)]" />,
    title: "secure payments",
    desc: "100% secure checkout",
  },
  {
    id: 3,
    icon: <Headset className="size-8 text-[var(--color-secondary)]" />,
    title: "24/7 support",
    desc: "we're here to help",
  },
];
function Hero() {
  return (
    <>
      <div className="flex items-center flex-col md:flex-row gap-4 p-4">
        <div className="w-[80%] mx-auto md:w-1/2 p-4">
          <h1 className="text-center md:text-start text-2xl lg:text-4xl capitalize text-[var(--color-text-primary)] font-bold font-display mb-1">
            Elevate Your Lifestyle
          </h1>
          <h2 className="text-center md:text-start text-2xl lg:text-4xl capitalize text-[var(--color-text-primary)] font-bold font-display mb-5">
            with{" "}
            <span className="text-[var(--color-supporting-decorative)]">
              Premium Products
            </span>
          </h2>
          <p className="text-center md:text-start text-[var(--color-text-secondary)]">
            Discover carefully curated products <br />
            designed for quality,style,and everyday comfort
          </p>
          <div className="flex flex-col gap-2 md:flex-row mt-6">
            <Button className="cursor-pointer capitalize px-8 sm:px-12 py-2 rounded-lg  bg-[var(--color-text-primary)] text-white">
              shop now
            </Button>
            <Button
              className="cursor-pointer capitalize px-6 py-2 rounded-lg  text-primary border border-[var(--color-supporting)]"
              variant="outline"
            >
              explore collection
            </Button>
          </div>
        </div>
        <div className="w-[80%] md:w-1/2 relative">
          <img className="w-full" src={HeroImage} alt="Hero section image" />
          <div className=" flex absolute w-56  sm:w-64 h-28 sm:h-32  top-[80%]  left-[2%] sm:left-[5%]  lg:-left-[8%] rounded-xl bg-[var(--color-background)] z-20 border p-3 sm:p-4">
            <div>
              <img
                src={HeroImage}
                alt="backpacknd watch"
                className="w-12 h-12  sm:w-16 sm:h-16 rounded-full "
              />
            </div>
            <div className="p-2">
              <p className="text-lg">Modern Comfort</p>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Minimal Design
              </p>
              <p className="pt-4 text-[#d9a04a]">
                ★★★★★ <span className="text-primary">4.8</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[80%] lg:w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 p-4">
        {prosItems.map((prosItem) => (
          <ProsCard key={prosItem.id} item={prosItem} />
        ))}
      </div>
    </>
  );
}

export default Hero;
