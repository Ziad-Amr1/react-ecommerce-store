import { PackageOpen } from "lucide-react";

export default function ProductThumb({ url, alt, className = "size-10" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted ${className}`}
    >
      {url ? (
        <img src={url} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <PackageOpen
          className="size-5 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </div>
  );
}