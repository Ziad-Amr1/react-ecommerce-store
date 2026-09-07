import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function ErrorDialog({ image, issue }) {
  return (
    <div className="bg-white border rounded-lg mt-8 p-4 select-none">
      <div>
        <img
          src={image}
          alt="Error Dialog Image"
          className="w-[200px] mx-auto"
        />
      </div>
      <div className="text-center">
        <h2 className="text-[var(--color-error)] font-extrabold font-[var(--font-display)] text-lg">
          Oops! Something went wrong
        </h2>
        <p className="text-[var(--color-text-secondary)] mt-3 mb-5 leading-6">
          We couldn't load the {issue}
          <br />
          Please check your connection and try again.
        </p>
      </div>

      <Button className="mx-auto flex cursor-pointer">
        <RefreshCcw data-icon="inline-start" />
        Try Again
      </Button>
    </div>
  );
}
