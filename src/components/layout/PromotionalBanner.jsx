import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

function PromotionalBanner() {
  return (
    <div className="bg-[url('/banner2.webp')] w-full h-[200px] md:h-[220px] lg:h-[250px] bg-cover rounded-xl my-10 bg-center relative select-none">
      <div className="absolute font-body text-white left-[20px] p-4 top-1/2 -translate-y-1/2">
        <span className="capitalize font-semibold sm:text-base md:text-lg">
          summer sale
        </span>
        <p className="mt-2 mb-2 font-bold text-xl sm:text-2xl lg:text-3xl">
          Up to 30% OFF
        </p>
        <span>On selected items. Limited time only!</span>
        <Button
          variant="outline"
          className="mt-5 flex items-center cursor-pointer text-[var(--color-text-primary)]"
        >
          Shop the sale
          <ArrowRightIcon data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}

export default PromotionalBanner;
