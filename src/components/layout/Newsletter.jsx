import { Mail } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Newsletter() {
  return (
    <div className=" flex flex-col md:flex-row items-center justify-between bg-[var(--color-surface-secondary)] my-10 py-6 px-8 rounded-xl select-none">
      <div
        className="p-2 font-display w-full md:w-[50%] text-[var(--color-text-primary)]"
        // style={{ border: "2px solid red" }}
      >
        <div className="flex items-center gap-6 w-full">
          <Mail className="size-9" />
          <div>
            <h2 className="text-base md:text-lg font-semibold">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm md:text-base font-extralight text-[var(--color-text-secondary)]">
              Get the latest updates on new arrivals and exclusive offers
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-3 mt-6 lg:flex-row lg:gap-6 items-center w-full md:w-[45%] justify-between"
        // style={{ border: "2px solid blue" }}
      >
        <div className="flex-1 w-full">
          <Field>
            <Input
              id="fieldgroup-email"
              type="email"
              placeholder="name@example.com"
              className="text-center text-[var(--color-text-primary)]"
            />
          </Field>
        </div>

        <div>
          <Button className="cursor-pointer capitalize px-6 py-2 rounded-lg  bg-[var(--color-text-primary)] text-white">
            subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
