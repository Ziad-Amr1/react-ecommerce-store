import { useMemo } from "react";

export default function ProductImagePreview({ file, alt }) {
  const previewUrl = useMemo(() => {
    if (!file) return "";

    return URL.createObjectURL(file);
  }, [file]);

  if (!previewUrl) {
    return null;
  }

  return <img src={previewUrl} alt={alt} className="h-full w-full object-cover" />;
}